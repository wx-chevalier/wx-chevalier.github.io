
---
title: Network-Series
linktitle: Network-Series
type: book
commentable: true
---

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![license: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey.svg)][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wx-chevalier/Network-Series">
    <img src="https://s2.ax1x.com/2020/01/06/lr21MT.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Network Series</h3>

  <p align="center">
    网络与协议·实践笔记
    <br />
    <a href="https://github.com/wx-chevalier/Network-Series"><strong>在线阅读 >> </strong></a>
    <br />
    <br />
    <a href="https://github.com/wx-chevalier/Network-Series">速览手册</a>
    ·
    <a href="https://github.com/wx-chevalier/Network-Series/issues">代码实践</a>
    ·
    <a href="https://github.com/wx-chevalier/Network-Series/issues">参考资料</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

# Introduction | 前言

# Network Series | 网络基础

[![image.png](https://i.postimg.cc/tT00Xqns/image.png)](https://postimg.cc/gwKtsPDp)

- 物理层：主要定义物理设备标准，如网线的接口类型、光纤的接口类型、各种传输介质的传输速率等。它的主要作用是传输比特流(就是由 1、0 转化为电流强弱来进行传输,到达目的地后在转化为 1、0，也就是我们常说的数模转换与模数转换)。这一层的数据叫做比特。

- 数据链路层：定义了如何让格式化数据以进行传输，以及如何让控制对物理介质的访问。这一层通常还提供错误检测和纠正，以确保数据的可靠传输。

- 网络层：在位于不同地理位置的网络中的两个主机系统之间提供连接和路径选择。Internet 的发展使得从世界各站点访问信息的用户数大大增加，而网络层正是管理这种连接的层。

- 传输层：定义了一些传输数据的协议和端口号(WWW 端口 80 等)，如：TCP(传输控制协议，传输效率低，可靠性强，用于传输可靠性要求高，数据量大的数据)，UDP(用户数据报协议，与 TCP 特性恰恰相反，用于传输可靠性要求不高，数据量小的数据，如 QQ 聊天数据就是通过这种方式传输的)。主要是将从下层接收的数据进行分段和传输，到达目的地址后再进行重组。常常把这一层数据叫做段。

- 会话层：通过传输层(端口号：传输端口与接收端口)建立数据传输的通路。主要在你的系统之间发起会话或者接受会话请求(设备之间需要互相认识可以是 IP 也可以是 MAC 或者是主机名)

- 表示层：可确保一个系统的应用层所发送的信息可以被另一个系统的应用层读取。例如，PC 程序与另一台计算机进行通信，其中一台计算机使用扩展二一十进制交换码(EBCDIC)，而另一台则使用美国信息交换标准码(ASCII)来表示相同的字符。如有必要，表示层会通过使用一种通格式来实现多种数据格式之间的转换。

- 应用层: 是最靠近用户的 OSI 层。这一层为用户的应用程序(例如电子邮件、文件传输和终端仿真)提供网络服务。

# 常用术语

IPAM：IP 地址管理；这个 IP 地址管理并不是容器所特有的，传统的网络比如说 DHCP 其实也是一种 IPAM，到了容器时代我们谈 IPAM，主流的两种方法：基于 CIDR 的 IP 地址段分配地或者精确为每一个容器分配 IP。但总之一旦形成一个容器主机集群之后，上面的容器都要给它分配一个全局唯一的 IP 地址，这就涉及到 IPAM 的话题。

Overlay：在现有二层或三层网络之上再构建起来一个独立的网络，这个网络通常会有自己独立的 IP 地址空间、交换或者路由的实现。

IPSesc：一个点对点的一个加密通信协议，一般会用到 Overlay 网络的数据通道里。

vxLAN：由 VMware、Cisco、RedHat 等联合提出的这么一个解决方案，这个解决方案最主要是解决 VLAN 支持虚拟网络数量（4096）过少的问题。因为在公有云上每一个租户都有不同的 VPC，4096 明显不够用。就有了 vxLAN，它可以支持 1600 万个虚拟网络，基本上公有云是够用的。

网桥 Bridge：连接两个对等网络之间的网络设备，但在今天的语境里指的是 Linux Bridge，就是大名鼎鼎的 Docker0 这个网桥。

BGP：主干网自治网络的路由协议，今天有了互联网，互联网由很多小的自治网络构成的，自治网络之间的三层路由是由 BGP 实现的。

SDN、Openflow：软件定义网络里面的一个术语，比如说我们经常听到的流表、控制平面，或者转发平面都是 Openflow 里的术语。

> 本书的精排目录导航版请参考 [https://ng-tech.icu/books/Network-Series](https://ng-tech.icu/books/Network-Series)。

# Nav | 关联导航

# About | 关于

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Awesome-Lists](https://github.com/wx-chevalier/Awesome-Lists): 📚 Guide to Galaxy, curated, worthy and up-to-date links/reading list for ITCS-Coding/Algorithm/SoftwareArchitecture/AI. 💫 ITCS-编程/算法/软件架构/人工智能等领域的文章/书籍/资料/项目链接精选。

- [Awesome-CS-Books](https://github.com/wx-chevalier/Awesome-CS-Books): :books: Awesome CS Books/Series(.pdf by git lfs) Warehouse for Geeks, ProgrammingLanguage, SoftwareEngineering, Web, AI, ServerSideApplication, Infrastructure, FE etc. :dizzy: 优秀计算机科学与技术领域相关的书籍归档。

## Copyright & More | 延伸阅读

笔者所有文章遵循[知识共享 署名 - 非商业性使用 - 禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://ng-tech.icu/books-gallery/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://ng-tech.icu/books-gallery/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/wx-chevalier/Network-Series.svg?style=flat-square
[contributors-url]: https://github.com/wx-chevalier/Network-Series/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wx-chevalier/Network-Series.svg?style=flat-square
[forks-url]: https://github.com/wx-chevalier/Network-Series/network/members
[stars-shield]: https://img.shields.io/github/stars/wx-chevalier/Network-Series.svg?style=flat-square
[stars-url]: https://github.com/wx-chevalier/Network-Series/stargazers
[issues-shield]: https://img.shields.io/github/issues/wx-chevalier/Network-Series.svg?style=flat-square
[issues-url]: https://github.com/wx-chevalier/Network-Series/issues
[license-shield]: https://img.shields.io/github/license/wx-chevalier/Network-Series.svg?style=flat-square
[license-url]: https://github.com/wx-chevalier/Network-Series/blob/master/LICENSE.txt

## Links

- https://segmentfault.com/a/1190000019891825

    