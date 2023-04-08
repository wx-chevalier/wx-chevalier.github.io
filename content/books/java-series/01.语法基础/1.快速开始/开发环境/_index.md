
---
title: 开发环境
linktitle: 开发环境
type: book
commentable: true
---

# Java 开发环境

# 多版本切换

## jenv

jenv 为我们提供了便捷的 Java 版本切换的功能：

```sh
$ brew install jenv

$ jenv add /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home/
$ jenv versions
* system
  1.8
  1.8.0.202-ea
  11.0
  11.0.2
  openjdk64-11.0.2
  oracle64-1.8.0.202-ea

$ jenv shell 1.8
$ java -version
java version "1.8.0_202-ea"
Java(TM) SE Runtime Environment (build 1.8.0_202-ea-b03)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b03, mixed mode)
```

    