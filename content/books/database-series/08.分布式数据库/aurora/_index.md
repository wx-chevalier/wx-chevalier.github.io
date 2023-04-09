
---
title: Aurora
linktitle: Aurora
type: book
commentable: true
---

# Aurora

- 实践了“日志即数据库”(参考《High Performance Transactions in Deuteronomy》) 的理念。

- 事务引擎和存储引擎分离。数据缓冲区提前预热。

- REDO 日志从事务引擎中剥离，归并到存储引擎中。

- 储存层可以有 6 个副本，多个副本之间通过 Gossip 协议可以保障数据的“自愈”能力。

- 主备服务的备机可达 15 份，提供强大的读服务能力。

- 持续可靠的云数据库服务能力。

- 数据存储跨多个区：提供了多级别容灾能力。

- 数据容灾能力：数据冗余、备份、实时恢复等多种能力集成到云服务，提高数据保障能力。

    