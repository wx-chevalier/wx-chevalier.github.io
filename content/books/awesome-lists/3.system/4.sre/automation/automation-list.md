
---
title: Automation-List
linktitle: Automation-List
type: book
commentable: true
---

# 自动化资料索引

- [Lessons Learned from Writing Over 300,000 Lines of Infrastructure Code](https://blog.gruntwork.io/5-lessons-learned-from-writing-over-300-000-lines-of-infrastructure-code-36ba7fadeac1)

# 系统设计

- [2018-如何设计一个大规模远程命令执行系统](https://mp.weixin.qq.com/s?__biz=MzUyMzA3MTY1NA==&mid=2247484177&idx=1&sn=570d6025960f668c315b45f11af8ef5b): 简单介绍了百度集群控制系统（Cluster Control System，以下简称 CCS 系统）通过构建两级数据模型、四级调度模型、三级代理执行的方式解决了这些问题，在本篇文章中，我们将续接前文，继续对 CCS 系统的设计实现进行详细剖析。

# Deploy Tools

- [2023-MRSK ![code](https://ng-tech.icu/assets/code.svg) ![star](https://img.shields.io/github/stars/mrsked/mrsk)](https://github.com/mrsked/mrsk): MRSK deploys web apps anywhere from bare metal to cloud VMs using Docker with zero downtime. It uses the dynamic reverse-proxy Traefik to hold requests while the new application container is started and the old one is stopped. It works seamlessly across multiple hosts, using SSHKit to execute commands. It was built for Rails applications, but works with any type of web app that can be containerized with Docker.

    