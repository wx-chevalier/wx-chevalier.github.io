
---
title: 调试工具
linktitle: 调试工具
type: book
commentable: true
---

# 线上调试

![Java 性能监控工具](https://s2.ax1x.com/2019/11/19/MgdMHP.png)

线上调试的典型场景譬如：

- 程序在稳定运行了，可是实现的功能点了没反应。
- 为了修复 Bug 而上线的新版本，上线后发现 Bug 依然在，却想不通哪里有问题？
- 想到可能出现问题的地方，却发现那里没打日志，没法在运行中看到问题，只能加了日志输出重新打包——部署——上线
- 程序功能正常了，可是为啥响应时间这么慢，在哪里出现了问题？
- 程序不但稳定运行，而且功能完美，但跑了几天或者几周过后，发现响应速度变慢了，是不是内存泄漏了？

如果瓶颈点在应用层和系统层均呈现出多变量分布，建议此时使用 JProfiler 等工具对应用进行 Profiling，获取应用的综合性能信息（注：Profiling 指的是在应用运行时，通过事件（Event-based）、统计抽样（Sampling Statistical）或植入附加指令（Byte-Code instrumentation）等方法，收集应用运行时的信息，来研究应用行为的动态分析方法）。譬如，可以对 CPU 进行抽样统计，结合各种符号表信息，得到一段时间内应用内的代码热点。

# Links

- https://mp.weixin.qq.com/s/t7G1tSrNJ603nIpgzMY2uw 这几款 JVM 故障诊断处理工具 你还不会？

    