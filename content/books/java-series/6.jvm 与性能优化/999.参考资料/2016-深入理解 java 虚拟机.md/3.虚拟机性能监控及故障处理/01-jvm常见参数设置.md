
---
title: 01-JVM常见参数设置
linktitle: 01-JVM常见参数设置
type: book
commentable: true
---

# JVM 常见参数设置

<!-- TOC -->

- [JVM 常见参数设置](#jvm-常见参数设置)
    - [内存设置](#内存设置)
        - [参数](#参数)
        - [设置经验](#设置经验)
    - [收集器设置](#收集器设置)
        - [参数](#参数-1)

<!-- /TOC -->

## 内存设置

### 参数

- `-Xms`：初始堆大小，JVM 启动的时候，给定堆空间大小。
- `-Xmx`：最大堆大小，如果初始堆空间不足的时候，最大可以扩展到多少。
- `-Xmn`：设置年轻代大小。`整个堆大小 = 年轻代大小 + 年老代大小 + 持久代大小`。持久代一般固定大小为 64M，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun 官方推荐配置为整个堆的 3/8。
- `-Xss`： 设置每个线程的 Java 栈大小。JDK 5 后每个线程 Java 栈大小为 1M。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在 3000~5000 左右。
- `-XX:NewRatio=n`：设置年轻代和年老代的比值。如为 3，表示年轻代与年老代比值为 1:3。
- `-XX:MaxTenuringThreshold`：设置垃圾最大年龄。如果设置为 0 的话，则年轻代对象不经过 Survivor 区，直接进入年老代。对于年老代比较多的应用（即 Minor GC 过后有大量对象存活的应用），可以提高效率。如果将此值设置为一个较大值，则年轻代对象会在 Survivor 区进行多次复制，这样可以增加对象再年轻代的存活时间，增加在年轻代即被回收的概率。

### 设置经验

- 开发过程的测试应用，要求物理内存大于 4G

	```
	-Xmx3550m
	-Xms3550m 
	-Xmn2g
	-Xss128k
	```

- 高并发本地测试使用，大对象相对较多（如 IO 流）

	```
	Xmx3550m
	-Xms3550m
	-Xss128k
	-XX:NewRatio=4
	-XX:SurvivorRatio=4
	-XX:MaxPermSize=160m
	-XX:MaxTenuringThreshold=0
	```

- 环境： 16G 物理内存，高并发服务，重量级对象中等（线程池，连接池等），常用对象比例为 40%（即运行过程中产生的对象 40% 是生命周期较长的）

	```
	-Xmx10G
	-Xms10G
	-Xss1M
	-XX:NewRatio=3
	-XX:SurvivorRatio=4 
	-XX:MaxPermSize=2048m
	-XX:MaxTenuringThreshold=5
	```



## 收集器设置

### 参数

- 收集器设置
	- `-XX:+UseSerialGC`：设置串行收集器，年轻带收集器。
	- `-XX:+UseParallelGC`：设置并行收集器。
	- `-XX:+UseParNewGC`：设置年轻代为并行收集。可与 CMS 收集同时使用。JDK 5.0 以上，JVM 会根据系统配置自行设置，所以无需再设置此值。
	- `-XX:+UseParallelOldGC`：设置并行年老代收集器，JDK6.0 支持对年老代并行收集。
	- `-XX:+UseConcMarkSweepGC`：设置年老代并发收集器，测试中配置这个以后，`-XX:NewRatio` 的配置失效，原因不明。所以，此时年轻代大小最好用 `-Xmn` 设置。
	- `-XX:+UseG1GC`：设置 G1 收集器。
- 并行收集器参数设置
	- `-XX:ParallelGCThreads=n`：设置并行收集器收集时最大线程数使用的 CPU 数。并行收集线程数。
	- `-XX:MaxGCPauseMillis=n`：设置并行收集最大暂停时间，单位毫秒。
	- `-XX:GCTimeRatio=n`：设置垃圾回收时间占程序运行时间的百分比。
	- `-XX:+UseAdaptiveSizePolicy`：设置此选项后，并行收集器会自动选择年轻代区大小和相应的 Survivor 区比例，以达到目标系统规定的最低相应时间或者收集频率等，此值建议使用并行收集器时，一直打开。
	- `-XX:CMSFullGCsBeforeCompaction=n`：由于 CMS 不对内存空间进行压缩、整理，所以运行一段时间以后会产生"碎片"，使得运行效率降低。此值设置运行多少次 GC 以后对内存空间进行压缩、整理。
	- `-XX:+UseCMSCompactAtFullCollection`：打开对年老代的压缩。可能会影响性能，但是可以消除碎片。






    