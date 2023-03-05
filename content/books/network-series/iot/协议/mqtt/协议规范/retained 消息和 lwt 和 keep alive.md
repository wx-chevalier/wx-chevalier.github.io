
---
title: Retained 消息和 LWT 和 Keep Alive
linktitle: Retained 消息和 LWT 和 Keep Alive
type: book
commentable: true
---

# Retained 消息和 LWT 和 Keep Alive

# Retained 消息

Retained 消息是指在 PUBLISH 数据包中 Retain 标识设为 1 的消息，Broker 收到这样的 PUBLISH 包以后，将保存这个消息，当有一个新的订阅者订阅相应主题的时候，Broker 会马上将这个消息发送给订阅者。有以下这些特点：

- 一个 Topic 只能有一条 Retained 消息，发布新的 Retained 消息将覆盖老的 Retained 消息（所以想删除一个 Retained 消息也很简单，只要向这个主题发布一个 Payload 长度为 0 的 Retained 消息就可以了）；
- 如果订阅者使用通配符订阅主题，它会收到所有匹配的主题上的 Retained 消息；
- 只有新的订阅者才会收到 Retained 消息，如果订阅者重复订阅一个主题，也会被当做新的订阅者，然后收到 Retained 消息；
- Broker 收到 Retained 消息后，会单独保存一份，再向当前的订阅者发送一份普通的消息（Retained 标识为 0）。当有新订阅者的时候， Broker 会把保存的这条消息发给新订阅者（Retained 标识为 1）。

Retained 消息和持久性会话的区别：

- Retained 消息是 Broker 为每一个 Topic 单独存储的；
- 持久性会话是 Broker 为每一个 Client 单独存储的

### 1.1. 代码实践

下面是 publisher 的代码，在发送消息时指定 retain 为 true

```python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.publish("test", payload="hello world", qos=0, retain=True)
    else:
        print("connection failed ", rc)

mqtt_client = mqtt.Client(client_id="demo_mqtt_pub")
mqtt_client.on_connect = on_connect

mqtt_client.connect("192.168.10.239", 1883)
mqtt_client.loop_forever()
```

下面是 subscriber 的代码

```python
import paho.mqtt.client as mqtt

'''
当代理响应订阅请求时被调用
'''
def on_subscribe(client, userdata, mid, granted_qos):
    print("granted_qos:", granted_qos)

'''
当收到关于客户订阅的主题的消息时调用
'''
def on_message(client, userdata, message):
    print("message retain", message.retain)
    print("message topic", message.topic)
    print("message payload", message.payload)

def on_connect(client, userdata, flags, rc):
    if rc == 0 :
        print("subscribing")
        client.subscribe("test", 0)
    else:
        print("connection failed ", rc)

mqtt_client = mqtt.Client(client_id="demo_mqtt_sub", clean_session=False)
mqtt_client.on_connect = on_connect
mqtt_client.on_subscribe = on_subscribe
mqtt_client.on_message = on_message

mqtt_client.connect("192.168.10.239", 1883)
mqtt_client.loop_forever()
```

在指定`retain`为`True`的情况下，先运行 publisher 的代码，之后再运行 subscriber 的代码，在 subscriber 运行的终端界面输出如下信息：

```bash
subscribing
granted_qos: (0,)
message retain 1
message topic test
message payload b'hello world'
```

输出的信息中`message retain`的值为 1，表示收到的消息为 retained 消息。

当再次运行 publisher 的代码，运行 subscriber 的控制台会输出如下内容：

```bash
message retain 0
message topic test
message payload b'hello world'
```

上述的输出结果同 Retained 消息特点中的第四点“Broker 收到 Retained 消息后，会单独保存一份，再向当前的订阅者发送一份普通的消息”所述一致，因为当前订阅者已经订阅了相应的话题，当 Broker 收到 Retained 消息之后，先保存下来，然而因为这个消息对于当前已经订阅了相应话题的订阅者来说是一个普通的消息所以`message retain`的值为 0。

## 2. LWT(Last Will and Testament)

LWT 是之前讲过的 Client 连接到 Broker 时提到的遗愿，包括遗愿主题、遗愿 QoS、遗愿消息等。当 Broker 检测到 Client 非正常地断开连接的时候，就会向遗愿主题发布一条消息。**遗愿相关的设置是在建立连接的时候**,在 CONNECT 数据包里面指定的。包括以下这些设置：

- Will Flag：是否使用 LWT
- Will QoS：发布遗愿消息时使用的 QoS
- Will Retain：遗愿消息的 Retain 标识
- Will Topic：遗愿主题名，不可使用通配符
- Will Message：遗愿消息内容

Broker 在以下情况下认为 Client 是非正常断开连接的：

- Broker 检测到底层的 I/O 异常；
- Client 未能在 Keep Alive 的间隔内和 Broker 之间有消息交互；
- Client 在关闭底层 TCP 连接前没有发送 DISCONNECT 数据包；
- Broker 因为协议错误关闭和 Client 的连接，比如 Client 发送了一个格式错误的 MQTT 数据包。

如果 Client 通过发布 DISCONNECT 数据包断开连接，是属于正常断开连接，不会触发 LWT 的机制，同时 Broker 会丢掉这个 Client 在连接时指定的 LWT 参数。

### 2.1. 代码实践：监控 Client 的状态

Client 在连接的时候，指定 Will Topic 为 will_test，Will Message 为"client is offline"，并设置该消息的 QoS 为 1，retain 也置为 True（设置为 True 表示会被 Broker 保留，同 Retained 消息）。同时在连接成功之后，向主题 will_test 发布一个内容为"client is online"的 Retained 消息。这样订阅者，无论在任何时候订阅"will_test"，都会获取 Client 当前的连接状态。client_will.py 代码如下：

```python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.publish("will_test", payload="client is online", qos=1, retain=True)
    else:
        print("connection failed ", rc)

mqtt_client = mqtt.Client(client_id="demo_mqtt_pub")
mqtt_client.on_connect = on_connect
mqtt_client.will_set("will_test", payload="client is offline", qos=1, retain=True)
mqtt_client.connect("192.168.10.239", 1883)
mqtt_client.loop_forever()
```

而负责监控的代码，则订阅 will_test，订阅的 QoS 为 1，client_monitor_will.py 代码如下：

```python
import paho.mqtt.client as mqtt

def on_message(client, userdata, message):
    print("message retain", message.retain)
    print("message payload", message.payload)

def on_connect(client, userdata, flags, rc):
    if rc == 0 :
        client.subscribe("will_test", 1)
    else:
        print("connection failed ", rc)

mqtt_client = mqtt.Client(client_id="demo_mqtt_sub", clean_session=False)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

mqtt_client.connect("192.168.10.239", 1883)
mqtt_client.loop_forever()
```

首先运行 client_will.py，之后再运行 client_monitor_will.py，终端输出如下信息：

```text
message retain 1
message payload b'client is online'
```

因为 client_will.py 运行之后，发布了一个 Retained 消息，当运行 client_monitor_will.py 之后，因为订阅了相应的话题，所以会收到该消息。这时候终止掉 client_will.py 的运行，输出如下信息：

```bash
message retain 0
message payload b'client is offline'
```

因为在终止的时候已经订阅了相应的话题，所以当终止之后，虽然遗愿消息中的 retain 被设为 1 了，但是对当前的订阅者来说是普通消息，所以 message retain 为 0。当这个时候终止掉 client_monitor_will.py 的运行，再次重新运行 client_monitor_will.py，输出如下信息：

```bash
message retain 1
message payload b'client is offline'
```

因为终止掉 client_will.py 的时候，发送的遗愿消息的 retain 被设为了 1，Broker 会保证发送的遗愿消息，当新的订阅者出现的时候，会把这个 Retained 消息发送给订阅者。

## 3. Keep Alive（连接保活）

Broker 需要知道 Client 是否正常地断开了和它的连接，以发送遗愿消息。实际上 Client 也需要能够很快地检测它失去了和 Broker 的连接，以便重新连接，虽然 TCP 协议在丢失连接时会通知上层应用，但是 TCP 有一个半打开连接的问题（half-open connection），在这种状态下，一端的 TCP 连接已经失效，但是另外一端并不知情，它认为连接依然是打开的，它需要很长的时间才能感知到对端连接已经断开了，这种情况在使用移动或者卫星网络的时候尤为常见。所以仅仅依赖 TCP 的连接状态检测是不够的，于是 MQTT 协议设计了一套 Keep Alive 机制。

> MQTT 协议是基于 TCP 的一个应用层协议

在建立连接的时候，我们可以传递一个 Keep Alive 参数，它的单位为秒，MQTT 协议中规定：**在 1.5 倍的 Keep Alive（1.5\*Keep Alive）的时间间隔内，如果 Broker 没有收到来自 Client 的任何数据包，那么 Broker 认为它和 Client 之间的连接已经断开；同样如果 Client 没有收到来自 Broker 的任何数据包，那么 Client 认为它和 Broker 之间的连接已经断开。**在 Broker 和 Client 之间没有任何数据包传输的时候，MQTT 中通过 PINGREQ/PINGRESP 来满足 Keep Alive 的约定和侦测连接状态。

- **PINGREQ**

PINGREQ 数据包中没有可变头和消息体，当 Client 在一个 Keep Alive 时间间隔内没有向 Broker 发送任何数据包，比如 PUBLISH 和 SUBSCRIBE 的时候，它应该向 Broker 发送 PINGREQ 数据包。

- **PINGRESP**

PINGRESP 数据包中没有可变头和消息体，当 Broker 收到来自 Client 的 PINGREQ 数据包之后，它会回复 Client 一个 PINGRESP 数据包。

对于 Keep ALive 机制，还需要注意以下几点：

- 如果在一个 Keep Alive 时间间隔内，Client 和 Broker 有过数据包传输，比如 PUBLISH 数据包，Client 就没有必要再使用 PINGREQ 了；
- Keep Alive 值是由 Client 指定，不同的 Client 可以指定不同的值；
- Keep Alive 的最大值为 18 小时 12 分 15 秒即 65535 秒；
- Keep Alive 的值设为 0 的话，代表不使用 Keep Alive 机制

    