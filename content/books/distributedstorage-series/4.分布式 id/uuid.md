
---
title: UUID
linktitle: UUID
type: book
commentable: true
---

# UUID

什么是 UUID？

UUID 是 Universally Unique Identifier 的缩写，它是在一定的范围内（从特定的名字空间到全球）唯一的机器生成的标识符。UUID 具有以下涵义：

UUID(Universally Unique Identifier)的标准型式包含 32 个 16 进制数字，以连字号分为五段，形式为 8-4-4-4-12 的 36 个字符，示例：550e8400-e29b-41d4-a716-446655440000，到目前为止业界一共有 5 种方式生成 UUID，详情见 IETF 发布的 UUID 规范 A Universally Unique IDentifier (UUID) URN Namespace。

经由一定的算法机器生成
为了保证 UUID 的唯一性，规范定义了包括网卡 MAC 地址、时间戳、名字空间（Namespace）、随机或伪随机数、时序等元素，以及从这些元素生成 UUID 的算法。UUID 的复杂特性在保证了其唯一性的同时，意味着只能由计算机生成。
非人工指定，非人工识别
UUID 是不能人工指定的，除非你冒着 UUID 重复的风险。UUID 的复杂性决定了“一般人“不能直接从一个 UUID 知道哪个对象和它关联。
在特定的范围内重复的可能性极小
UUID 的生成规范定义的算法主要目的就是要保证其唯一性。但这个唯一性是有限的，只在特定的范围内才能得到保证，这和 UUID 的类型有关（参见 UUID 的版本）。

UUID 是 16 字节 128 位长的数字，通常以 36 字节的字符串表示，示例如下：

3F2504E0-4F89-11D3-9A0C-0305E82C3301

其中的字母是 16 进制表示，大小写无关。

GUID（Globally Unique Identifier）是 UUID 的别名；但在实际应用中，GUID 通常是指微软实现的 UUID。

UUID 的版本

UUID 具有多个版本，每个版本的算法不同，应用范围也不同。

首先是一个特例－－Nil UUID－－通常我们不会用到它，它是由全为 0 的数字组成，如下：

00000000-0000-0000-0000-000000000000

UUID Version 1：基于时间的 UUID

基于时间的 UUID 通过计算当前时间戳、随机数和机器 MAC 地址得到。由于在算法中使用了 MAC 地址，这个版本的 UUID 可以保证在全球范围的唯一性。但与此同时，使用 MAC 地址会带来安全性问题，这就是这个版本 UUID 受到批评的地方。如果应用只是在局域网中使用，也可以使用退化的算法，以 IP 地址来代替 MAC 地址－－Java 的 UUID 往往是这样实现的（当然也考虑了获取 MAC 的难度）。

UUID Version 2：DCE 安全的 UUID

DCE（Distributed Computing Environment）安全的 UUID 和基于时间的 UUID 算法相同，但会把时间戳的前 4 位置换为 POSIX 的 UID 或 GID。这个版本的 UUID 在实际中较少用到。

UUID Version 3：基于名字的 UUID（MD5）

基于名字的 UUID 通过计算名字和名字空间的 MD5 哈希值得到。这个版本的 UUID 保证了：相同名字空间中不同名字生成的 UUID 的唯一性；不同名字空间中的 UUID 的唯一性；相同名字空间中相同名字的 UUID 重复生成是相同的。

UUID Version 4：随机 UUID

根据随机数，或者伪随机数生成 UUID。这种 UUID 产生重复的概率是可以计算出来的，但随机的东西就像是买彩票：你指望它发财是不可能的，但狗屎运通常会在不经意中到来。

UUID Version 5：基于名字的 UUID（SHA1）

和版本 3 的 UUID 算法类似，只是哈希值计算使用 SHA1（Secure Hash Algorithm 1）算法。

UUID 的应用

从 UUID 的不同版本可以看出，Version 1/2 适合应用于分布式计算环境下，具有高度的唯一性；Version 3/5 适合于一定范围内名字唯一，且需要或可能会重复生成 UUID 的环境下；至于 Version 4，我个人的建议是最好不用（虽然它是最简单最方便的）。

通常我们建议使用 UUID 来标识对象或持久化数据，但以下情况最好不使用 UUID：

映射类型的对象。比如只有代码及名称的代码表。
人工维护的非系统生成对象。比如系统中的部分基础数据。
对于具有名称不可重复的自然特性的对象，最好使用 Version 3/5 的 UUID。比如系统中的用户。如果用户的 UUID 是 Version 1 的，如果你不小心删除了再重建用户，你会发现人还是那个人，用户已经不是那个用户了。（虽然标记为删除状态也是一种解决方案，但会带来实现上的复杂性。）

UUID 生成器

```sh
[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}
```

    