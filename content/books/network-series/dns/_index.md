
---
title: DNS
linktitle: DNS
type: book
commentable: true
---

# DNS

![ByteByteGO DNS 请求流图](https://assets.ng-tech.icu/item/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_cc3fa478-9da1-477f-b285-89b92bc2f93f.png)

在整个 DNS 过程中有四个重要概念：

- DNS Resolver - 递归解析器，主要是接收客户端发出的域名解析请求，并发送 DNS query 查询请求。对于客户端来说它不需要任何操劳，等待 DNS Resolver 告诉自己域名转 IP 的结果就好。

- Root Server - 这是转换 IP 执行的第一步查询，根服务器并不会保存具体的域名 IP 映射信息。它就像一个索引服务器，会告诉你下一步该去那台 TLD Server 查询。

- TLD Server - 这是顶级域名服务器，是执行 IP 查询的第二步，这里会告诉 DNS Resolver 权威域名服务器的地址。

- Authoriative Server - 权威域名服务器就是包含了完整的机器名的域名，例如：www.example.com ，在这台机器上保存了这个具体域名对应的 IP 地址。

![](https://assets.ng-tech.icu/item/007rAy9hgy1g2sxhs1y9gj30u00k0dgq.jpg)

一个用户在浏览器输入了：example.com，这时会产生一个 DNS 查询，从而进入到 DNS Resolver 中；Resolver 会进入到 root server 进行查询；root server 返回了 TLD server 的地址，查询请求转向顶级域名服务，这里是 .com 服务器。递归解析器向 .com 服务器发送一个请求；TLD server 收到请求后会返回 example.com 权威服务器的地址；递归解析器又发了一个向权威服务器查询的请求，至此权威服务器查询自己的映射表拿到 IP；返回查询到的 IP 给了 DNS Resolver；DNS Resolver 返回 IP 给浏览器，浏览器将会用这个 IP 来建立连接，发起请求;客户端通过这个 IP 地址，发起一个 HTTP 请求；服务器解析请求，并返回数据到浏览器。

    