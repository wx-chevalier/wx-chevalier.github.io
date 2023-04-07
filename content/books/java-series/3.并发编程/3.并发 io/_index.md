
---
title: 3.并发 IO
linktitle: 3.并发 IO
type: book
commentable: true
---

# NIO

Java NIO，被称为新 IO(New IO)，是 Java 1.4 引入的，用来替代 IO API 的，它是基于 IO 复用技术的非阻塞 IO，不是异步 IO。在早期的 JDK1.4 和 1.5update10 版本之前，JDK 的 Selector 基于 select/poll 模型实现；在 JDK1.5 update10 和 Linux2 .6 以上版本，Sun 优化了 Selector 的实现，它在底层使用了 epoll 替换了 select/poll。在 JDK1.7 提供的 AIO 新增了异步的套接字通道，它是真正的异步 IO,在异步 IO 操作的时候可以传递信号变量，当操作完成之后会回调相关的方法，异步 IO 也称为 AIO。

对于网络 IO 相关的基础知识可以参考 [Linux 网络 IO](https://ng-tech.icu/books/DistributedSystem-Series/#/?q=Linux网络IO) 以及[并发 IO](https://ng-tech.icu/books/DistributedSystem-Series/#/?q=并发IO) 的相关章节。

# Links

- https://parg.co/kmG
- https://mp.weixin.qq.com/s/uOPio2rBwcIK7R8O6FNCkA

    