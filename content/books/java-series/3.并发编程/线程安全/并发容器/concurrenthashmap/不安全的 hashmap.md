
---
title: 不安全的 HashMap
linktitle: 不安全的 HashMap
type: book
commentable: true
---

# 不安全的 HashMap

在多线程使用场景中，应该尽量避免使用线程不安全的 HashMap，而使用线程安全的 ConcurrentHashMap。那么为什么说 HashMap 是 线程不安全的，下面举例子说明在并发的多线程使用场景中使用 HashMap 可能造成死循环。

```java
 public class HashMapInfiniteLoop {

    private static HashMap<Integer,String> map = new HashMap<Integer,String>(2，0.75f);
    public static void main(String[] args) {
        map.put(5，"C");

        new Thread("Thread1") {
            public void run() {
                map.put(7, "B");
                System.out.println(map);
            };
        }.start();

        new Thread("Thread2") {
            public void run() {
                map.put(3, "A);
                System.out.println(map);
            };
        }.start();
    }
}
```

其中，map 初始化为一个长度为 2 的数组，loadFactor=0.75，`threshold=2*0.75=1`，也就是说当 put 第二个 key 的时候，map 就需要进行 resize。通过设置断点让线程 1 和线程 2 同时 debug 到 transfer 方法的首行。注意此时两个线程已经成功添加数据。放开 thread1 的断点至 transfer 方法的“Entry next = e.next;” 这一行；然后放开线程 2 的的断点，让线程 2 进行 resize。结果如下图。

![断点调试图](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/superbed/2021/07/16/60f18e4d5132923bf8417c48.jpg)

注意，Thread1 的 e 指向了 key(3)，而 next 指向了 key(7)，其在线程二 rehash 后，指向了线程二重组后的链表。线程一被调度回来执行，先是执行 newTalbe[i] = e， 然后是 e = next，导致了 e 指向了 key(7)，而下一次循环的 next = e.next 导致了 next 指向了 key(3)。

![断点调试图](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/superbed/2021/07/16/60f18e855132923bf843320f.jpg)

e.next = newTable[i] 导致 key(3).next 指向了 key(7)。注意：此时的 key(7).next 已经指向了 key(3)， 环形链表就这样出现了。

![循环示意图](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/superbed/2021/07/16/60f18ea95132923bf8445220.jpg)

于是，当我们用线程一调用 map.get(11)时，悲剧就出现了：Infinite Loop。

    