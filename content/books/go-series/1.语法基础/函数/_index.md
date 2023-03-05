
---
title: 函数
linktitle: 函数
type: book
commentable: true
---

# 函数

函数对应操作序列，是程序的基本组成元素。Go 语言中的函数有具名和匿名之分：具名函数一般对应于包级的函数，是匿名函数的一种特例，当匿名函数引用了外部作用域中的变量时就成了闭包函数，闭包函数是函数式编程语言的核心。方法是绑定到一个具体类型的特殊函数，Go 语言中的方法是依托于类型的，必须在编译时静态绑定。接口定义了方法的集合，这些方法依托于运行时的接口对象，因此接口对应的方法是在运行时动态绑定的。Go 语言通过隐式接口机制实现了鸭子面向对象模型。

# Links

- [2017-The Zoo of Go Functions](https://parg.co/U5u): An overview about: anonymous, higher-order, closures, concurrent, deferred, and other kinds of Golang funcs.

    