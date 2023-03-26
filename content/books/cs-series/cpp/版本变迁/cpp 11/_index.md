
---
title: CPP 11
linktitle: CPP 11
type: book
commentable: true
---

# C++11

# 特性弃用

在学习 C++ 1x 之前，我们先了解一下从 C++ 11 开始，被弃用的主要特性：

> **注意**：弃用不等于废弃，只是用于暗示程序员这些特性将从未来的标准中消失，应该尽量避免使用。但是，已弃用的特性依然是标准库的一部分，并且出于兼容性的考虑，这些特性其实会永久保留。

- **如果一个类有析构函数，为其生成拷贝构造函数和拷贝赋值运算符的特性被弃用了。**
- **不再允许字符串字面值常量赋值给一个 char \*。如果需要用字符串字面值常量赋值和初始化一个 char \*，应该使用 const char \* 或者 auto。**

```cpp
char *str = "hello world!"; // 将出现弃用警告
```

- **C++98 异常说明、unexcepted_handler、set_unexpected() 等相关特性被弃用，应该使用 noexcept。**
- **auto_ptr 被弃用，应使用 unique_ptr。**
- **register 关键字被弃用。**
- **bool 类型的 ++ 操作被弃用。**
- **C 语言风格的类型转换被弃用，应该使用 static_cast、reinterpret_cast、const_cast 来进行类型转换。**

还有一些其他诸如参数绑定（C++11 提供了 `std::bind` 和 `std::function`）、`export` 等特性也均被弃用。前面提到的这些特性**如果你从未使用或者听说过，也请不要尝试去了解他们，应该向新标准靠拢**，直接学习新特性。毕竟，技术是向前发展的。

    