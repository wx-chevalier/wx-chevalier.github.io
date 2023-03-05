
---
title: 链表
linktitle: 链表
type: book
commentable: true
---

# 链表

链表是一种通过指针串联在一起的线性结构，每一个节点是又两部分组成，一个是数据域一个是指针域（存放指向下一个节点的指针），最后一个节点的指针域指向 null（空指针的意思）。链接的入口点称为列表的头结点也就是 head。

![链表示意](https://pic.imgdb.cn/item/6118e3e35132923bf884f8fa.png)

链表主要包含以下几类：

- 单链表：单链表中的节点只能指向节点的下一个节点。

- 双链表：每一个节点有两个指针域，一个指向下一个节点，一个指向上一个节点。双链表 既可以向前查询也可以向后查询。

![双链表示意图](https://pic.imgdb.cn/item/6118e4c25132923bf8882d9b.jpg)

- 循环链表: 循环链表，顾名思义，就是链表首尾相连。循环链表可以用来解决约瑟夫环问题。

![循环链表](https://pic.imgdb.cn/item/6118e4e15132923bf888a3aa.jpg)

# Links

- [A Gentle Introduction to Data Structures: How Linked Lists Work](https://medium.freecodecamp.com/a-gentle-introduction-to-data-structures-how-linked-lists-work-5adc793897dd#.8vgkaayu3)

    