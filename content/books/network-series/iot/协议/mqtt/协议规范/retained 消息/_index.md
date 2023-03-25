
---
title: Retained 消息
linktitle: Retained 消息
type: book
commentable: true
---

# Retained 消息

让我们来假设一个场景：你有一个温度传感器，它每三个小时向一个 Topic 发布当前的温度。那么问题来了，有一个新的订阅者在它刚刚发布了当前温度之后订阅了这个主题，那么这个订阅端什么时候能才能收到温度消息？对的，它必须等到三个小时以后，温度传感器再次发布消息的时候才能收到。在这之前，这个新的订阅者对传感器的温度数据一无所知。

这个时候就轮到 Retained 消息出场解决这个问题了。Retained 消息是指在 PUBLISH 数据包中 Retain 标识设为 1 的消息，Broker 收到这样的 PUBLISH 包以后，将保存这个消息，当有一个新的订阅者订阅相应主题的时候，Broker 会马上将这个消息发送给订阅者。

Retain 消息有以下一些特点：

- 一个 Topic 只能有 1 条 Retained 消息，发布新的 Retained 消息将覆盖老的 Retained 消息；
- 如果订阅者使用通配符订阅主题，它会收到所有匹配的主题上的 Retained 消息；
- 只有新的订阅者才会收到 Retained 消息，如果订阅者重复订阅一个主题，也会被当做新的订阅者，然后收到 Retained 消息；
- Retained 消息发送到订阅者时，消息的 Retain 标识仍然是 1，订阅者可以判断这个消息是否是 Retained 消息，以做相应的处理。

注意：Retained 消息和持久性会话没有任何关系，Retained 消息是 Broker 为每一个 Topic 单独存储的，而持久性会话是 Broker 为每一个 Client 单独存储的。如果你想删除一个 Retained 消息也很简单，只要向这个主题发布一个 Payload 长度为 0 的 Retained 消息就可以了。

# LWT（最后遗嘱）

LWT 全称为 Last Will and Testament，也就是我们在连接到 Broker 时提到的遗嘱，包括遗嘱主题、遗嘱 QoS、遗嘱消息等。顾名思义，当 Broker 检测到 Client 非正常地断开连接的时候，就会向遗嘱主题里面发布一条消息。遗嘱相关的设置是在建立连接的时候，在 CONNECT 数据包里面的 Variable header(可变头与) Payload(有效载荷) 中指定的。

- Will Flag：是 1 否 0 使用 LWT
- Will Topic：遗嘱主题名，不可使用通配符（在 CONNECT 报文中的 有效载荷 中 设置）
- Will Qos：发布遗嘱消息时使用的 QoS 等级，如果遗嘱标志（Will Flag）被设置为 0，遗嘱 QoS 也必须设置为 0(0x00)
- Will Retain：遗嘱消息的 Retain 标识
- Will Message：遗嘱消息内容（在 CONNECT 报文中的有效载荷中设置）

Broker 在以下情况下认为 Client 是非正常断开连接的：

- Broker 检测到底层的 I/O 异常；
- Client 未能在 Keep Alive 的间隔内和 Broker 之间有消息交互；
- Client 在关闭底层 TCP 连接前没有发送 DISCONNECT 数据包；
- Broker 因为协议错误关闭和 Client 的连接，比如 Client 发送了一个格式错误的 MQTT 数据包。

如果 Client 通过发布 DISCONNECT 数据包断开连接，这个属于正常断开连接，不会触发 LWT 的机制，同时，Broker 还会丢弃掉这个 Client 在连接时指定的 LWT 参数。根据遗嘱的属性和触发机制，我们不难看出，遗嘱常用于获取设备的连接状态。

注意，设置好遗嘱以后还不够（因为你只要订阅者一启动就会收到遗嘱消息，如果此时发布者已经在线，会导致不准确），所以，还需要在设备成功连接 MQTT 的时候主动发个消息,发送的主题必须和遗嘱的主题相同，设置好消息的 retain 属性，让其自动纠正过来。

    