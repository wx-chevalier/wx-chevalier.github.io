
---
title: 报文协议
linktitle: 报文协议
type: book
commentable: true
---

# TCP

# TCP 报文

我们首先要了解 TCP 报文组成，根据 TCP 报文组成格式，重点了解几个重要的字段有助于我们在后面分析 TCP/IP 报文。

![TCP 报文标志位](http://www.2cto.com/uploadfile/2013/1022/20131022025345890.png)

上图中有几个字段需要重点介绍下：

- 序号：Seq 序号，占 32 位，用来标识从 TCP 源端向目的端发送的字节流，发起方发送数据时对此进行标记。
- 确认序号：Ack 序号，占 32 位，只有 ACK 标志位为 1 时，确认序号字段才有效，Ack=Seq+1。
- 标志位：共 6 个，即 URG、ACK、PSH、RST、SYN、FIN 等，具体含义如下：
  - URG：紧急指针(urgent pointer)有效。
  - ACK：确认序号有效。
  - PSH：接收方应该尽快将这个报文交给应用层。
  - RST：重置连接。
  - SYN：发起一个新连接。
  - FIN：释放一个连接。

需要注意的是：不要将确认序号 Ack 与标志位中的 ACK 搞混了，确认方 Ack=发起方 Req+1，两端配对。

    