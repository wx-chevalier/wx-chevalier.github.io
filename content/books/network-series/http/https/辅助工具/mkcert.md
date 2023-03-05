
---
title: mkcert
linktitle: mkcert
type: book
commentable: true
---

# mkcert

mkcert 是一个用于创建本地信任的开发证书的便捷工具。在本地开发环境中使用真实的 CA（Certificate Authority，证书颁发机构）签发的证书，是非常困难的，特别是对于像 example.net、localhost 或者 127.0.0.1 这样的主机来说，使用真实的 CA 签发的证书是不可能的。在这样的情况下，自签发的证书可能是唯一的选择。mkcert 可以生成自签发的证书，并把本地 CA 安装到系统根证书库中。对于本地开发和测试以外的所有情况，我们强烈建议使用真实的 CA 签发的证书以避免信任问题。

    