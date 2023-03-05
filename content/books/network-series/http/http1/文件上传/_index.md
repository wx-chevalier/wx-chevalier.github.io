
---
title: 文件上传
linktitle: 文件上传
type: book
commentable: true
---

# 文件上传

multipart/form-data 最初由 《RFC 1867: Form-based File Upload in HTML》 (opens new window)文档提出。

```s
Since file-upload is a feature that will benefit many applications, this proposes an extension to HTML to allow information providers to express file upload requests uniformly, and a MIME compatible representation for file upload responses.
```

由于文件上传功能将使许多应用程序受益，因此建议对 HTML 进行扩展，以允许信息提供者统一表达文件上传请求，并提供文件上传响应的 MIME 兼容表示。文件上传为什么要用 multipart/form-data？

```s
The encoding type application/x-www-form-urlencoded is inefficient for sending large quantities of binary data or text containing non-ASCII characters. Thus, a new media type,multipart/form-data, is proposed as a way of efficiently sending the values associated with a filled-out form from client to server.
```

1867 文档中也写了为什么要新增一个类型，而不使用旧有的 application/x-www-form-urlencoded：因为此类型不适合用于传输大型二进制数据或者包含非 ASCII 字符的数据。平常我们使用这个类型都是把表单数据使用 url 编码后传送给后端，二进制文件当然没办法一起编码进去了。所以 multipart/form-data 就诞生了，专门用于有效的传输文件。

也许你有疑问？那可以用 application/json 吗？其实我认为，无论你用什么都可以传，只不过会要综合考虑一些因素的话，multipart/form-data 更好。例如我们知道了文件是以二进制的形式存在，application/json 是以文本形式进行传输，那么某种意义上我们确实可以将文件转成例如文本形式的 Base64 形式。但是呢，你转成这样的形式，后端也需要按照你这样传输的形式，做特殊的解析。并且文本在传输过程中是相比二进制效率低的，那么对于我们动辄几十 M 几百 M 的文件来说是速度是更慢的。

# #multipart/form-data 规范

摘自 《RFC 1867: Form-based File Upload in HTML》：

```s
Content-type: multipart/form-data, boundary=AaB03x

--AaB03x
content-disposition: form-data; name="field1"
Joe Blow
--AaB03x
content-disposition: form-data; name="pics"; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--AaB03x--
```

    