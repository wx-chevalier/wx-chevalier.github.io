
---
title: Range
linktitle: Range
type: book
commentable: true
---

# Range

Range 是在 HTTP/1.1 (opens new window)中新增的一个字段，这个特性也是我们使用的迅雷等支持多线程下载以及断点下载的核心机制。首先客户端会发起一个带有 Range: bytes=0-xxx 的请求，如果服务端支持 Range，则会在响应头中添加 Accept-Ranges: bytes 来表示支持 Range 的请求，之后客户端才可能发起带 Range 的请求。

```s
GET /360_0388.jpg HTTP/1.1
Host: limit.qiufeng.com
Connection: keep-alive
...
Range: bytes=0-102399

HTTP/1.1 206 Partial Content
Server: openresty/1.13.6.2
Date: Sat, 19 Sep 2020 06:31:11 GMT
Content-Type: image/jpeg
Content-Length: 102400
....
Content-Range: bytes 0-102399/3670627

...（这里是文件流）
```

可以看到请求这里多出一个字段 Range: bytes=0-102399 ，服务端也多出一个字段 Content-Range: bytes 0-102399/3670627，以及返回的 状态码为 206. 服务端通过请求头中的 Range: bytes=0-xxx 来判断是否是进行 Range 处理，如果这个值存在而且有效，则只发回请求的那部分文件内容，响应的状态码变成 206，表示 Partial Content，并设置 Content-Range。如果无效，则返回 416 状态码，表明 Request Range Not Satisfiable。如果请求头中不带 Range，那么服务端则正常响应，也不会设置 Content-Range 等。

| Value |      Description      |
| :---- | :-------------------: |
| 206   |    Partial Content    |
| 416   | Range Not Satisfiable |

# Range 格式

Range 的格式为：

```
Range:(unit=first byte pos)-[last byte pos]
```

即`Range: 单位（如bytes）= 开始字节位置-结束字节位置`。

我们来举个例子，假设我们开启了多线程下载，需要把一个 5000byte 的文件分为 4 个线程进行下载。

- Range: bytes=0-1199 头 1200 个字节
- Range: bytes=1200-2399 第二个 1200 字节
- Range: bytes=2400-3599 第三个 1200 字节
- Range: bytes=3600-5000 最后的 1400 字节

服务器给出响应：

第 1 个响应

- Content-Length：1200
- Content-Range：bytes 0-1199/5000

第 2 个响应

- Content-Length：1200
- Content-Range：bytes 1200-2399/5000

第 3 个响应

- Content-Length：1200
- Content-Range：bytes 2400-3599/5000

第 4 个响应

- Content-Length：1400
- Content-Range：bytes 3600-5000/5000

如果每个请求都成功了，服务端返回的 response 头中有一个 Content-Range 的字段域，Content-Range 用于响应头，告诉了客户端发送了多少数据，它描述了响应覆盖的范围和整个实体长度。一般格式：

`Content-Range: bytes (unit first byte pos) - [last byte pos]/[entity length]`即`Content-Range：字节 开始字节位置-结束字节位置／文件大小`。

    