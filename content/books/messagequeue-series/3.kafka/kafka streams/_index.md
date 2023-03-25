
---
title: Kafka Streams
linktitle: Kafka Streams
type: book
commentable: true
---

# Kafka Streams

# 概览

## 不足

### 检查点机制

我认为这个问题是客观存在的，无可辩驳，Kafka Sterams 确实存在检查点机制问题。检查点可以说是操作分布式系统的基础。那么，到底什么是检查点呢？Kafka 是一套分布式日志记录系统。在消息处理方面，Kafka 同时支持有状态与无状态两类。在无状态处理方面，用户只会接收一条消息，然后进行实际处理，非常简单。但一旦涉及有状态处理，情况就立刻变得不同。现在，开发者面对的第一个难题就是存储状态，只有这样才能在遇到错误时配合对应状态完成系统恢复。

对于 Kafka Streams，恢复工作看似非常简单，因为拥有重构状态所需要的全部消息。理论上，甚至能够通过一些方法将保存在 Kafka 中的消息控制在每键约一条的水平。
但这就没问题了吗？当然不是。因为每键一条消息，状态量仍然相当夸张。如果大家拥有上千亿个键，那就需要在状态主题中保存超过 1 千亿条消息，毕竟所有状态变更都被放置在了对应的状态变更主题内。随着键数量的进一步增加，状态的体积也会随之膨胀。

这种运营思路总结起来就是，一旦某个节点无法正常运行，则必须从主题中重播所有消息并将其插入数据库内。只有执行完成整个流程，处理才能恢复至原有状态并继续进行。在极端情况或者发生人为错误的前提下，一切运行 Kafka Streams 作业的设备都有可能崩溃或者宕机，这意味着所有节点都必须重播所有状态变更消息，而后才能继续正常处理新的消息。

这种大规模重播可能会带来长达数小时的停机时间。不少 Kafka Streams 的潜在用户表示，他们估算出的停机时间至少达到 4 个小时。好的，就算 4 个小时，完成恢复流程之后，接下来还有这一时段内新增的大量消息。追上这部分进度，系统才算是真正回到运行正轨之上。

有鉴于此，数据库与处理框架往往采用检查点机制（在 Flink 中，这一机制被称为快照）。所谓检查点，是将当前整体态定入至持久存储（S3/HDFS）中。因此，一旦发生大规模故障，恢复程序将直接读取前一个检查点，重播该检查点之后的所有消息（通常在 1000 秒以内），以便快速恢复后续处理能力。总体而言，检查点支持下的恢复流程一般仅耗时几秒钟到几分钟不等。

可以看到，在检查点的帮助下，系统的停机时间将由 Kafka Streams 的数小时显著缩短至几秒和几分钟水平。对于实时系统，停机时间必须尽可能短，我们也必须尽最大努力确保分布式系统能够尽快从故障中恢复过来。

## 随机排序

随机排序是分布式处理流程的重要组成部分，其本质是将数据与同一个键整合起来的实现方法。如果需要对数据进行分析，则很可能会接触到随机排序。

事实上，Kafka Streams 的随机排序与 Flink 或者 Spark Streaming 中的随机排序存在巨大差异。下面来看看 JavaDoc 中关于其工作原理的描述：

> 如果某个键变更运算符在实际使用之前发生了变化（例如 selectKey(KeyValueMapper)、map(KeyValueMapper), flatMap(KeyValueMapper) 或者 transform(TransformerSupplier, String…)），且此后没有发生数据重新分发（例如通过 through(String)），那么在 Kafka 当中创建一个内部重新分区主题。该主题将被命名为“\${applicationId}-XXX-repartition”的形式，其中，“applicationId”由用户在 StreamsConfig 中通过 APPLICATION_ID_CONFIG 参数进行指定，“XXX”为内部生成的名称，而“-repartition”则为固定后缀。开发者可以通过 KafkaStreams.toString() 检索所有已生成的内部主题名称。

这意味着只要变更键（一般用于分析），Kafka Streams 就会新建一个主题来实现随机排序。这种随机排序实现方法，证实了我在与开发者沟通时做出的几个基本假设：我曾与多位前 Kafka Streams 开发者进行过交流，他们并不清楚这种新的主题机制。他们直接在集群上执行实时分析，但这会快速增加代理上的负载与数据总量，并最终导致系统崩溃。但从使用者的角度来看，他们只是在正常执行数据处理。

如果开发者对性能并不关注，那么这种方法似乎也能接受。但是，其他一些处理框架（例如 Apache Flink）显然更加理想，它们提供更完善的内置随机排序功能，而且也能与 Kafka 配合使用。这些系统，无疑能够带来更顺畅的使用体验。

结论：由于缺少两大关键功能，Kafka Streams 实用性会大打折扣。我们不可能接受在实时生产系统上经历长达数小时的停机，无法接受随机排序功能导致集群崩溃。而且除非在每一项 KSQL 查询之前都进行解释，否则我们也弄不明白可能出现哪些随机排序操作。

# Links

- http://www.jasongj.com/kafka/kafka_stream/ 2017-Kafka设计解析（七）- Kafka Stream

    