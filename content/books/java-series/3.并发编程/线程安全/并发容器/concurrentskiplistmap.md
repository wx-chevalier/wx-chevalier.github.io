
---
title: ConcurrentSkipListMap
linktitle: ConcurrentSkipListMap
type: book
commentable: true
---

ConcurrentSkipListMap 其内部采用 SkipLis 数据结构实现。为了实现 SkipList，ConcurrentSkipListMap 提供了三个内部类来构建这样的链表结构：Node、Index、HeadIndex。其中 Node 表示最底层的单链表有序节点、Index 表示为基于 Node 的索引层，HeadIndex 用来维护索引层次。到这里我们可以这样说 ConcurrentSkipListMap 是通过 HeadIndex 维护索引层次，通过 Index 从最上层开始往下层查找，一步一步缩小查询范围，最后到达最底层 Node 时，就只需要比较很小一部分数据了。

    