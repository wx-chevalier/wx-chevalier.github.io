
---
title: MVCC 实现
linktitle: MVCC 实现
type: book
commentable: true
---

# 锁与事务

InnoDB 采用的是两阶段锁定协议，事务执行过程中，根据需要不断的加锁，最后 COMMIT 或 ROLLBACK 的时候一次性释放所有锁，实质上是一种悲观并发控制（悲观锁），而悲观锁会降低系统的并发性能。为了提高并发性能，InnoDB 同时还实现了多版本并发控制（MVCC）。

# MVCC

MySQL 的 Innodb 引擎支持多种事务隔离级别，而其中的 RR 级别（Repeatable-Read）就是依靠 MVCC 来实现的，普通的查询操作都是非锁定读，如果存在事务冲突，会利用 Undo Log 获取新事务操作之前的镜像返回，在读已提交的隔离级别下，会获取新事务修改前的最新的一份已经提交的数据，而在可重复读的隔离级别下，会读取该事务开始时的数据版本。当有多个事务并发操作同一行记录时，该记录会同时存在多个 Undo Log，每个 Undo Log 就是一个版本。

所有的锁定读都是当前读，也就是读取当前记录的最新版本；对于锁定读而言，不会利用 Undo Log 读取镜像。另外所有的 insert、update、delete 操作也是当前读，update、delete 会在更新之前进行一次当前读，然后加锁，而 insert 因为会触发唯一索引检测，也会包含一个当前读。

MySQL 中 MVCC 的版本指的是事务 ID(Transaction ID)，首先来看一下 MySQL Innodb 中行记录的存储格式，除了最基本的行信息外，还会有一些额外的字段，譬如和 MVCC 有关的字段：`DATA_TRX_ID` 和 `DATA_ROLL_PTR`，如下是一张表的初始信息：

| Primary Key | Time      | Name | DATA_TRX_ID | DATA_ROLL_PTR |
| ----------- | --------- | ---- | ----------- | ------------- |
| 1           | 2018-4-28 | Huan | 1           | NULL          |

- `DATA_TRX_ID`：最近更新这条记录的 Transaction ID，数据库每开启一个事务，事务 ID 都会增加，每个事务拿到的 ID 都不一样
- `DATA_ROLL_PTR`：用来存储指向 Undo Log 中旧版本数据指针，支持了事务的回滚。

对于 SELECT 操作，满足以下两个条件 Innodb 会返回该行数据：

- 该行的创建版本号小于等于当前版本号，用于保证在 SELECT 操作之前所有的操作已经执行落地。
- 该行的删除版本号大于当前版本或者为空。删除版本号大于当前版本意味着有一个并发事务将该行删除了。

对于数据操作类型语句，INSERT 会将新插入的行的创建版本号设置为当前系统的版本号，DELETE 会将要删除的行的删除版本号设置为当前系统的版本号。UPDATE 则是会转换成 INSERT 与 DELETE 的组合，将旧行的删除版本号设置为当前版本号，并将新行 INSERT 同时设置创建版本号为当前版本号。其中，写操作(INSERT、DELETE 和 UPDATE)执行时，需要将系统版本号递增。由于旧数据并不真正的删除，所以必须对这些数据进行清理，Innodb 会开启一个后台线程执行清理工作，具体的规则是将删除版本号小于当前系统版本的行删除，这个过程叫做 Purge。通过 MVCC 很好的实现了事务的隔离性，可以达到 Repeated Read 级别，要实现 Serializable 还必须加锁。

    