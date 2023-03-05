
---
title: 2019-Cloud Native Data Center Networking
linktitle: 2019-Cloud Native Data Center Networking
type: book
commentable: true
---

# Cloud Native Data Center Networking

作者 Dinesh G. Dutt 是一家网络公司的首席科学家，在网络行业有 20 多年工作经验，曾 是 Cisco Fellow，是 TRILL、VxLAN 等协议的合作者（co-author）之一。

# 传统网络架构面临瓶颈

分布式应用（distributed application）正在与网络（network）共舞，而且前者是主角。分布式应用突然变换了舞步，现代数据中心的故事也由此开始。理解这种转变对网络从业人员至关重要，否则只会不断被一些新名词带着走。

## 应用-网络架构演进

![The evolution of application architecture](https://s3.ax1x.com/2021/01/25/sL9d2T.png)

应用架构演进：

1. 单体应用

   - 通常部署在 mainframe 上。
   - 特定的厂商提供网络方案，**协议是私有的**（不是 TCP/IP 协议）。
   - 以今天的眼光看，应用所需的带宽极小。

2. 客户端-服务器应用

   - 工作站和 PC 时代。
   - LAN 开始兴起，充斥着各种 L2、L3 和更上层协议。
     - 以太网、Token Ring、FDDI 等是比较流行的互连方式。带宽上限 100Mbps。
     - **TCP/IP 体系开始发展**，但还没用成为主流。

3. Web 应用

   - 以太网和 TCP/IP 一统互联网，其他绝大部分协议成为历史。
   - 计算和网络虚拟化：**虚拟机时代**。

4. 微服务（分布式应用）

   - 大规模的数据处理（例如 MapReduce），使数据中心网络的带宽瓶颈**从南北向变成东西向**，这是一个历史性的转变。
   - **容器时代**。

## 21 世纪以来的网络设计

![Access-aggregation-core network architecture](https://s3.ax1x.com/2021/01/25/sL9TZd.png)

上图是在上世纪末开始占据统治地位的网络架构：接入-汇聚-核心三级网络架构。

### 桥接（Bridging）的魅力

这种网络架构重度依赖交换（或称桥接，bridging），而在同时期，互联网（the internet）真正快速发展成型。既然支撑互联网的是 IP 路由（IP routing）技术，为什么数据中心网络没有选择路由（routing），而是选择的交换（bridging）呢？三方面原因：

1. **交换芯片**的出现（silicon switched packet forwarding）

   - 做数据转发的芯片原先主要用在**网卡**，现在用于功能更强大的**交换设备**。
   - 这种设备显然要求芯片具备**更高密度的接口**，而这样的芯片在当时**只支持交换**（bridging），不支持路由（routing）。

2. **厂商特定的软件栈**（proprietary network software stacks）在企业中占据主导地位

   - “客户端-服务器”模型所处的时代，TCP/IP 只是众多协议种的一种，并没有今天所处的统治地位。
   - 但各家的协议有一个共同点：**二层协议是一样的，都是走交换**（bridging）。因 此**汇聚层以下走交换**就是顺理成章也是唯一的选择。
   - 接入-汇聚-核心成为了一种通用的网络架构：

     - 汇聚以下走交换（bridging），不区分厂商
     - 汇聚以上走各家的三层协议
     - 这样就避免了为每家厂商的设备单独搭建一张网络。

3. **交换网络**所宣称的**零配置**（zero configuration of bridging）

   - 路由网络很难配置，甚至对某些厂商的设备来说，直到今天仍然如此。需要很多显式 配置。
   - 相比交换，路由的延迟更大，更消耗 CPU 资源。
   - 交换网络是自学习的（self-learning），也是所谓的“零配置”（zero configurations）。

### 构建和扩展的桥接网络

厂商设备无关、高性能芯片加上零配置，使得桥接网络在那个年代取得很大成功。但这种网 络也存在一些**限制**：

1. 广播风暴和 STP：这是自学习的机制决定的，

   - MAC 头中没有 TTL 字段，因此一旦形成环路就无法停下来。
   - STP（生成树协议）：避免交换网络出现环路，非常复杂，因此很难做到没有 bug。

2. 泛洪成本

   - 大的交换网络的泛洪
   - 缓解：划分 VLAN，使得泛洪域限制到 VLAN 内。

3. 网关高可用

   - **网关**配置在**汇聚交换机**。
   - 为保证高可用，一组汇聚配置同一个网关；一台挂掉后自动切换到另一台。需要协议 支持，这种协议称为**第一跳路由协议**（First Hop Routing Protocol, **FHRP**）。
   - **FHRP 原理**：几台路由器之间互相检测状态，确保永远有且只有一台在应答对网关的 ARP 请求。FHRP 协议举例：

     - HSRP（Hot Standby Routing Protocol）：思科的私有协议。
     - **VRRP**（Virtual Router Rundundency Protocol）：目前用的最多的协议。

### 接入-汇聚-核心网络架构存在的问题

- **广播风暴**是所有在那个年代运维过这种网络的网工们的噩梦 —— 即便已经开启了 STP。
- **应用（applications）变了** —— 服务器之间的东西向流量开始成为瓶颈，而这种网络架构主要面向的是“客 户端-服务器”模式的南北向流量时代。
- **应用的规模**显著变大，在故障、复杂性和敏捷度方面对网络提出了完全不同于以往的新需求。

现有网络架构无法解决以上问题。

- 不可扩展性（Unscalability）

  - 泛洪：自学习机制是 “flood-and-learn”，因此泛洪是不可避免的。当网络规模非常大时（例如大规模虚拟机场景），定期地会有上百万的泛洪包，终端计算节点不堪重负。
  - VLAN 限制：VLAN 总共 4096 个，无法满足云计算时代的多租户需求。
  - 汇聚应答 ARP 的负担：汇聚负责应答 ARP。ARP 数量可能非常多，导致汇聚交换机 CPU 飙升。
  - 交换机水平扩展性和 STP 限制：理论上，增加汇聚交换机数量似乎就能增加东西向带宽。但是，**STP 不支持两个以上 的交换机**场景，否则后果无法预测。因此汇聚交换机就固定在了两个，无法扩展。

- 复杂性（Complexity）
  - 交换网络需要运行大量不同类型的协议，例如：STP、FHRP、链路检测协议；厂商特定的协议，例如 VLAN Trunking Protocol（VTP），显著增加了网络的复杂性，STP 使得网络只能用到一半的链路带宽。

## The Stories Not Told

一些对这种网络方案的改进尝试：TRILL 和 MLAG。经过时间沉淀，其他各种上层协议（L3+）已经退潮，IP 协议成为唯一主流。是时候从网络需求出发，设计一种新的架构了。

# Links

- http://arthurchiao.art/blog/cloud-native-data-center-networking-notes-zh/

    