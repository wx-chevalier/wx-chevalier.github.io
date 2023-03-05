
---
title: 分布式时钟
linktitle: 分布式时钟
type: book
commentable: true
---

# 分布式时钟

对于串行的事务来说，很简单的就是跟着时间的脚步走就可以，先来后到的发生。分布式世界里面，我们要协调不同节点之间的先来后到关系，但是不同节点本身承认的时间又各执己见，于是我们创造了网络时间协议（NTP）试图来解决不同节点之间的标准时间，但是 NTP 本身表现并不如人意，所以我们又构造除了逻辑时钟，最后改进为向量时钟。

# NTP

NTP 的一些缺点，无法完全满足分布式下并发任务的协调问题，包括节点间时间不同步，硬件时钟漂移，线程可能休眠，操作系统休眠，硬件休眠等。

![](https://ww1.sinaimg.cn/large/007rAy9hgy1g29ec73ojnj30cv060js9.jpg)

# 逻辑时钟

定义事件先来后到，`t’ = max(t, t_msg + 1)`

![](https://ww1.sinaimg.cn/large/007rAy9hgy1g29ec73ojnj30cv060js9.jpg)

# 向量时钟

`t_i’ = max(t_i, t_msg_i)`

# 原子时钟

    