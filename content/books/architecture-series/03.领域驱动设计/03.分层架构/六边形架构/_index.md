
---
title: 六边形架构
linktitle: 六边形架构
type: book
commentable: true
---

# 六边形架构

六边形架构是 Alistair Cockburn 在 2005 年提出，解决了传统的分层架构所带来的问题，实际上它也是一种分层架构，只不过不是上下，而是变成了内部和外部（如下图所示）。

![](https://i.postimg.cc/rsZb2H0L/image.png)

六边形架构又称为端口-适配器架构，这个名字更容器理解。六边形架构将系统分为内部（内部六边形）和外部，内部代表了应用的业务逻辑，外部代表应用的驱动逻辑、基础设施或其他应用。适配器分为两种类型（如下图所示），左侧代表 UI 的适配器被称为主动适配器（Driving Adapters），因为是它们发起了对应用的一些操作。而右侧表示和后端工具链接的适配器，被称为被动适配器（Driven Adapters），因为它们只会对主适配器的操作作出响应。

![](https://i.postimg.cc/KjCNNh34/image.png)

    