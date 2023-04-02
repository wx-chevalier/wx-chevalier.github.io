
---
title: C
linktitle: C
type: book
commentable: true
---

# C 语言

C 是系统编程界的通用语言。每个常用的操作系统及其相关的系统库都用 C 编写，每个系统都提供一个 C 编译器。为了避免在每个系统都将做出大量不兼容更改的情况下，在每个系统之间出现语言差异，已为该语言编写了严格的标准。

该标准被称为 ISO / IEC 9899：1999（E），但更常用的简称是 C99。该标准由国际标准组织（ISO）维护，完整的标准可在线购买。诸如 C89（1989 年发布的 C99 的前身）和 ANSI C 等较旧的标准版本不再通用，并且包含在最新标准中。标准文档是非常技术性的，并且详细介绍了该语言的每个部分。例如，它解释了语法（以 Backus Naur 形式），标准的 #define 值以及操作应如何表现。

注意 C 标准未定义的内容也很重要。最重要的是，该标准需要适合当前和将来的每种体系结构。因此，注意不要定义依赖于体系结构的区域。C 标准和基础体系结构之间的“胶水”是我们下面讨论的应用程序二进制接口（Application Binary Interface，ABI）。在一些地方，标准将提到特定的操作或构造具有未指定或与实现有关的结果。显然，如果程序员要编写可移植的代码，他们将不能依赖于这些结果。

# GNU C

GNU C 编译器（通常称为 gcc）几乎完全实现了 C99 标准。但是，它也实现了对标准的一系列扩展，程序员通常会使用这些扩展来获得额外的功能，但会牺牲可移植到另一个编译器的代价。这些扩展通常与非常低级的代码有关，并且在系统编程领域中更为常见。此区域中最常用的扩展是内联汇编代码。程序员应阅读 gcc 文档，并了解何时使用了与标准不符的功能。

可以指示 gcc 严格遵守标准（例如 `-std=c99` 标志），并在完成某些未在标准中的操作时警告或创建错误。如果您需要确保可以轻松地将代码移动到另一个编译器，那么这显然是适当的。

# C++ 与 C

我们经常在 C++ 中使用一些 C 语言代码（甚至古老的 C 语言代码），例如 Linux 系统调用。在 C++11 出现之前，大部分人当谈及 C 与 C++ 的区别是什么时，普遍除了回答面向对象的类特性、泛型编程的模板特性外，就没有其他的看法了，甚至直接回答差不多，也是大有人在。下面的韦恩图大致上回答了 C 和 C++ 相关的兼容情况：

![](https://i.postimg.cc/W4pLpjFp/image.png)

C++ 不是 C 的一个超集，在编写 C++ 时，也应该尽可能的避免使用诸如 `void*` 之类的程序风格。而在不得不使用 C 时，应该注意使用 extern "C" 这种特性，将 C 语言的代码与 C++代码进行分离编译，再统一链接这种做法，例如：

```c
// foo.h
#ifdef __cplusplus
extern "C" {
#endif

int add(int x, int y);

#ifdef __cplusplus
}
#endif

// foo.c
int add(int x, int y) {
    reutrn x+y;
}

// main.cpp
#include "foo.h"
int main() {
    add(1, 2);
    return 0;
}
```

应先使用 `gcc` 编译 C 语言的代码：

```bash
gcc -c foo.c
```

编译出 foo.o 文件，再使用 `g++` 将 C++代码和 `.o` 文件链接起来（或者都编译为 `.o` 再统一链接）：

```bash
g++ main.cpp foo.o -o main
```

    