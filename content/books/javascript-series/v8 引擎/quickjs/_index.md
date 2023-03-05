
---
title: QuickJS
linktitle: QuickJS
type: book
commentable: true
---

# QuickJS

QuickJS 支持 ES2019 规范，包括模块，异步生成器和代理。同时可选地支持数学扩展，例如 BigInt、BigFloat 和运算符重载。

主要特点：

- 小巧且易于嵌入：只需几个 C 文件，无外部依赖，x86 下一个简单的 hello world 示例程序仅 190 KB 的大小。
- 具有极低启动时间的快速解释器：在台式 PC 的单核上，在大约 100 秒内运行 ECMAScript 测试套件 56000 次测试。运行时实例的完整生命周期在不到 300 微秒的时间内完成。
- 支持 ES2019，包括模块、异步生成器和完整的 Annex B 支持（传统的 Web 兼容性）。
- 100％的通过了 ECMAScript 测试用例。
- 可以将 Javascript 源编译为没有外部依赖的可执行文件。
- 使用引用计数（以减少内存使用并具有确定性行为）的垃圾收集与循环删除。
- 数学扩展：BigInt，BigFloat，运算符重载，bigint 模式，数学模式。
- 在 Javascript 中实现的具有上下文着色的命令行解释器。
- 带有 C 库包装库构建的内置标准库。

    