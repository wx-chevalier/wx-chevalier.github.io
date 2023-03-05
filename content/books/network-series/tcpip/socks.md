
---
title: Socks
linktitle: Socks
type: book
commentable: true
---

# Socks

SOCKS 是一组由 Internal 工程工作小组（IETF）所开发出来的开放软件开放标准，用来处理网络安全的事宜。SOCKS 象一堵墙被夹在 Internal 服务器和客户端之间，对于出入企业网络的资讯提供流量和安全的管理。SOCKS 这个名词并不是一组英文字头的缩写，而是一个和 TCP/IP 的 Socket 端口有关的安全标准，一般防火墙系统通常是象网关（Gateway）一样是作用在 OSI 模型的第七层也就是应用层上，对 TCP/IP 的高级协议，如 Telnet、FTP、HTTP 和 SMTP 加以管制，而 SOCKS 作用在 OSI 模型的第四层也就是会话层上，象一个代理一样对客户端到服务器端或服务器和服务器之间的数据联系，提供安全上的服务。由于 SOCKS 作用在会话层上，因此它是一个提供会话层到会话层间安全服务的方案，不受高层应用程序变更的影响。

那 SOCKS4 和 SOCKS5 又有什么不同？具体表现在 SOCKS4 只能代理 TCP 协议，而 SOCKS5 什么协议都可以代理，而 QQ 使用的是 UDP 协议，所以它不能使用 SOCKS4 代理，而象国外的 ICQ 使用比 UDP 协议安全的 TCP 协议，所以就可以使用 SOCKS4 代理。

那 SOCKS 代理和 HTTP 代理有什么不同？从上文我们知道 SOCKS 工作在会话层上，而 HTTP 工作在应用层上，Socks 代理只是简单地传递数据包，而不必关心是何种应用协议(比如 FTP、HTTP 和 NNTP 请求)，所以 Socks 代理服务器比应用层代理服务器要快得多。

    