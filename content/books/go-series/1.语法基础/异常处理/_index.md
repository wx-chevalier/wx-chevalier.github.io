
---
title: 异常处理
linktitle: 异常处理
type: book
commentable: true
---

# Go 中的异常处理

错误处理是每个编程语言都要考虑的一个重要话题。在 Go 语言的错误处理中，错误是软件包 API 和应用程序用户界面的一个重要组成部分。在程序中总有一部分函数总是要求必须能够成功的运行。比如 strconv.Itoa 将整数转换为字符串，从数组或切片中读写元素，从 map 读取已经存在的元素等。这类操作在运行时几乎不会失败，除非程序中有 BUG，或遇到灾难性的、不可预料的情况，比如运行时的内存溢出。如果真的遇到真正异常情况，我们只要简单终止程序就可以了。

排除异常的情况，如果程序运行失败仅被认为是几个预期的结果之一。对于那些将运行失败看作是预期结果的函数，它们会返回一个额外的返回值，通常是最后一个来传递错误信息。如果导致失败的原因只有一个，额外的返回值可以是一个布尔值，通常被命名为 ok。比如，当从一个 map 查询一个结果时，可以通过额外的布尔值判断是否成功：

```go
if v, ok := m["key"]; ok {
	return v
}
```

但是导致失败的原因通常不止一种，很多时候用户希望了解更多的错误信息。如果只是用简单的布尔类型的状态值将不能满足这个要求。在 C 语言中，默认采用一个整数类型的 errno 来表达错误，这样就可以根据需要定义多种错误类型。在 Go 语言中，syscall.Errno 就是对应 C 语言中 errno 类型的错误。在 syscall 包中的接口，如果有返回错误的话，底层也是 syscall.Errno 错误类型。

比如我们通过`syscall`包的接口来修改文件的模式时，如果遇到错误我们可以通过将`err`强制断言为`syscall.Errno`错误类型来处理：

```go
err := syscall.Chmod(":invalid path:", 0666)
if err != nil {
	log.Fatal(err.(syscall.Errno))
}
```

我们还可以进一步地通过类型查询或类型断言来获取底层真实的错误类型，这样就可以获取更详细的错误信息。不过一般情况下我们并不关心错误在底层的表达方式，我们只需要知道它是一个错误就可以了。当返回的错误值不是 `nil` 时，我们可以通过调用 `error` 接口类型的 `Error` 方法来获得字符串类型的错误信息。

# Links

- [2017-Pipeline Patterns in Go](https://medium.com/statuscode/pipeline-patterns-in-go-a37bb3a7e61d): In this article, that pipeline pattern in Golang is extended with improved error-handling and cancellation.

    