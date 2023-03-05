
---
title: 包与模块
linktitle: 包与模块
type: book
commentable: true
---

# 包与模块

Go 语言程序的初始化和执行总是从 main.main 函数开始的。但是如果 main 包导入了其它的包，则会按照顺序将它们包含进 main 包里（这里的导入顺序依赖具体实现，一般可能是以文件名或包路径名的字符串顺序导入）。

如果某个包被多次导入的话，在执行的时候只会导入一次。当一个包被导入时，如果它还导入了其它的包，则先将其它的包包含进来，然后创建和初始化这个包的常量和变量,再调用包里的 init 函数，如果一个包有多个 init 函数的话，调用顺序未定义(实现可能是以文件名的顺序调用)，同一个文件内的多个 init 则是以出现的顺序依次调用（init 不是普通函数，可以定义有多个，所以也不能被其它函数调用）。最后，当 main 包的所有包级常量、变量被创建和初始化完成，并且 init 函数被执行后，才会进入 main.main 函数，程序开始正常执行。下图是 Go 程序函数启动顺序的示意图：

![包初始化流程](https://s2.ax1x.com/2019/11/30/QVHSRP.png)

要注意的是，在 main.main 函数执行之前所有代码都运行在同一个 goroutine，也就是程序的主系统线程中。因此，如果某个 init 函数内部用 go 关键字启动了新的 goroutine 的话，新的 goroutine 只有在进入 main.main 函数之后才可能被执行到。

# Links

- [Go 1.11 Modules](https://parg.co/01g): Go 1.11 includes preliminary support for versioned modules as proposed here.

- [2018-go-modules-by-example #Series#](https://github.com/go-modules-by-example/index): Go modules by example is a series of work-along guides.

- [2019-Using Go Modules](https://blog.golang.org/using-go-modules): This blog post is a tutorial to introduction to the basic operations needed to get started using modules. A followup post will cover releasing modules for others to use.

    