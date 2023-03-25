
---
title: 5.Pulsar
linktitle: 5.Pulsar
type: book
commentable: true
---

# Pulsar

Apache Pulsar 是一个开源的 pub-sub（发布-订阅）消息与流媒体平台，与 Apache Kafka 在同一领域展开竞争。它提供了我们所期望的功能，如低延迟的异步及同步消息传递，可进行容量伸缩的消息持久化存储，以及多种客户端程序库。Pulsar 吸引我们的地方，是能轻易实现容量伸缩，尤其适合在多用户类型的大型组织中使用。Pulsar 原生支持多租户、异地备份、基于角色的访问控制和计费隔离。此外，我们还期望 Pulsar 能解决高容量数据系统中，消息日志无限增长的问题。在这些系统中，事件一旦持久化，就需要无限期地保存，并且订阅者可以从历史节点开始订阅消息。这是通过一个分层存储的模型来实现的。尽管 Pulsar 对于大型组织是一个有前景的平台，但依然有提升的空间。目前，安装 Pulsar 需要管理 ZooKeeper 和 BookKeeper 以及其他工具。我们期待随着 Pulsar 的日益普及，用户很快能够得到更广泛的社区支持。

# Links

- https://mp.weixin.qq.com/s/v4A--nGiDTt58pZyIzepeg 比拼 Kafka，大数据分析新秀 Pulsar 到底好在哪

    