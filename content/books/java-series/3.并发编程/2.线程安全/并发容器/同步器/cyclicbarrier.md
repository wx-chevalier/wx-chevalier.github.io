
---
title: CyclicBarrier
linktitle: CyclicBarrier
type: book
commentable: true
---

# CyclicBarrier

CyclicBarrier 是加强版的 CountDownLatch，CyclicBarrier 允许让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续运行。

- CyclicBarrier 的某个线程运行到某个点上之后，该线程即停止运行，直到所有的线程都到达了这个点，所有线程才重新运行；CountDownLatch 则不是，某线程运行到某个点上之后，只是给某个数值 -1 而已，该线程继续运行
- CyclicBarrier 只能唤起一个任务，CountDownLatch 可以同时唤起多个任务
- CyclicBarrier 可重用，CountDownLatch 不可重用，计数值为 0 该 CountDownLatch 就不可再用了
- CountDownLatch 内部是基于 AQS 队列同步器实现，CyclicBarrier 基于 ReentrantLock 和 Condition 实现等待机制和唤醒的

`CyclicBarrie`有两个构造方法，`CyclicBarrier(int parties) `创建一个新的 `CyclicBarrier`，它将在给定数量的参与者（线程）处于等待状态时启动，但它不会在启动 barrier 时执行预定义的操作。`CyclicBarrier(int parties, Runnable barrierAction) `多了一个传入的屏障被唤醒时指定优先执行的方法，该操作由最后一个进入 barrier 的线程执行。

- `await() ` 在所有参与者都已经在此 barrier 上调用 await 方法之前，将一直等待。
- `await(long timeout, TimeUnit unit) ` 在所有参与者都已经在此屏障上调用 await 方法之前将一直等待,或者超出了指定的等待时间。
- `int getNumberWaiting() ` 返回当前在屏障处等待的参与者数目。
- `int getParties() ` 返回要求启动此 barrier 的参与者数目。
- `boolean isBroken() ` 查询此屏障是否处于损坏状态。
- `void reset() ` 将屏障重置为其初始状态。

# 基础使用

```java

class CyclicBarrierTaskTest implements Runnable {
    private CyclicBarrier cyclicBarrier;

    private int timeout;

    public CyclicBarrierTaskTest(CyclicBarrier cyclicBarrier, int timeout) {
        this.cyclicBarrier = cyclicBarrier;
        this.timeout = timeout;
    }

    @Override
    public void run() {
        TestCyclicBarrier.print("正在running...");
        try {
            TimeUnit.MILLISECONDS.sleep(timeout);
            TestCyclicBarrier.print("到达栅栏处，等待其它线程到达");
            cyclicBarrier.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }

        TestCyclicBarrier.print("所有线程到达栅栏处，继续执行各自线程任务...");
    }
}

public class TestCyclicBarrier {

    public static void print(String str) {
        SimpleDateFormat dfdate = new SimpleDateFormat("HH:mm:ss");
        System.out.println("["+ dfdate.format(new Date()) + "]"
                + Thread.currentThread().getName() + str);
    }

    public static void main(String[] args) {
        int count = 5;

        ExecutorService es = Executors.newFixedThreadPool(count);

        CyclicBarrier barrier = new CyclicBarrier(count, new Runnable() {

            @Override
            public void run() {
                TestCyclicBarrier.print("所有线程到达栅栏处,可以在此做一些处理...");
            }
        });
        for (int i = 0; i < count; i++)
            es.execute(new CyclicBarrierTaskTest(barrier, (i + 1) * 1000));
    }

}

[11:07:00]pool-1-thread-2 正在running...
[11:07:00]pool-1-thread-1 正在running...
[11:07:00]pool-1-thread-5 正在running...
[11:07:00]pool-1-thread-3 正在running...
[11:07:00]pool-1-thread-4 正在running...
[11:07:01]pool-1-thread-1 到达栅栏处，等待其它线程到达
[11:07:02]pool-1-thread-2 到达栅栏处，等待其它线程到达
[11:07:03]pool-1-thread-3 到达栅栏处，等待其它线程到达
[11:07:04]pool-1-thread-4 到达栅栏处，等待其它线程到达
[11:07:05]pool-1-thread-5 到达栅栏处，等待其它线程到达
[11:07:05]pool-1-thread-5 所有线程到达栅栏处,可以在此做一些处理...
[11:07:05]pool-1-thread-1 所有线程到达栅栏处，继续执行各自线程任务...
[11:07:05]pool-1-thread-2 所有线程到达栅栏处，继续执行各自线程任务...
[11:07:05]pool-1-thread-5 所有线程到达栅栏处，继续执行各自线程任务...
[11:07:05]pool-1-thread-3 所有线程到达栅栏处，继续执行各自线程任务...
[11:07:05]pool-1-thread-4 所有线程到达栅栏处，继续执行各自线程任务...
```

# 源码分析

## 初始化

```java
/** 重入 */
private final ReentrantLock lock = new ReentrantLock();
private final Condition trip = lock.newCondition();
private final int parties;
private final Runnable barrierCommand;
private Generation generation = new Generation();
private int count;
public CyclicBarrier(int parties, Runnable barrierAction) {
    if (parties <= 0) throw new IllegalArgumentException();
    this.parties = parties;
    this.count = parties;
    this.barrierCommand = barrierAction;
}
public CyclicBarrier(int parties) {
    this(parties, null);
}
```

可以看出屏障计数器不能为 0 。内部是依赖重入锁 ReentrantLock 和 Condition 实现的，这点和 CountDownLatch 不一样。

## await()方法

```java
public int await() throws InterruptedException, BrokenBarrierException {
    try {
        return dowait(false, 0L);
    } catch (TimeoutException toe) {
        throw new Error(toe); // cannot happen
    }
}
```

`await()`方法主要依靠`dowait`方法时 u，会让线程会到达屏障点时一直处于等待中：

```java
private int dowait(boolean timed, long nanos)
    throws InterruptedException, BrokenBarrierException,  TimeoutException {
    final ReentrantLock lock = this.lock;
    lock.lock();  //加锁
    try {
        //屏障的每次使用都表示为生成实例,每当屏障被触发或重置时，生成都会改变
        final Generation g = generation;
        //broken破碎的意思，检测Generation是否破碎，就抛出异常。
        if (g.broken)
            throw new BrokenBarrierException();
            //检测到线程执行了中断操作,抛异常，终止CyclicBarrie操作
        if (Thread.interrupted()) {
            //将当前屏障生成设置为已断开（broken置为true），并唤醒所有人。仅在持锁时调用。
            breakBarrier();
            throw new InterruptedException();
        }
        //每当有线程执await时，屏障总数就递减1一个
        int index = --count;
        //屏障数为0时，说明线程都已到达屏障点，开门执行
        if (index == 0) {  // tripped
            boolean ranAction = false;
            try {
                final Runnable command = barrierCommand;
                //触发线构造函数时，传入的优先执行的线程任务，如果有
                if (command != null)
                    command.run();
                ranAction = true;
                //唤醒所有等待线程，并重新初始化Generation ，broken置为false
                nextGeneration();
                return 0;
            } finally {
                //  如果唤醒失败，
                if (!ranAction)
                //则中断CyclicBarrier，并唤醒所有等待线程
                    breakBarrier();
            }
        }
        // 屏障未到达时的逻辑，一个死循坏， 自选操作
        for (;;) {
            try {
                //如果未指定超时等待时间，则调用Condition.await()方法使线程处于等待
                if (!timed)
                    trip.await();
                    //如果指定了超时等待时间大于0，则使用Condition的超时等待方法
                else if (nanos > 0L)
                    nanos = trip.awaitNanos(nanos);
            } catch (InterruptedException ie) {
                //发生异常处理操作
                if (g == generation && ! g.broken) {
                    breakBarrier();
                    throw ie;
                } else {
                    //中断当前线程
                    Thread.currentThread().interrupt();
                }
            }
            // generation 破碎时（中断操作），则抛异常，
            if (g.broken)
                throw new BrokenBarrierException();
            if (g != generation)
                return index;
                //超时等待了 唤醒所又线程，并抛出异常
            if (timed && nanos <= 0L) {
                breakBarrier();
                throw new TimeoutException();
            }
        }
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

当线程调用 `await` 方法，首先会拿到 `ReentrantLock` 重入锁执行加锁操作，然后判断是否有线程执行了中断操作，如果有则抛出异常，没有就继续向下执行，把屏障计数器做递减操作，然后判断这个屏障计数器是否为 0 ，如果递减后的计数器等于 0，则表明所有线程都已到达屏障点。

然后判断是否有传入指定的优先执行任务，如果有则先启动这个任务，然后唤醒所有等待的线程，重置屏障计数器 `count` 和 `Generation`。如果屏障值不为 0，则执行一个死循环，也就是自选操作。自选操作中，会先判断是否制定了超时等待时间，如果没有指定就执行 `Condition` 的 `await` 方法，让线程一直处于等待中，除非被唤醒或有其它线程执行了中断 CyclicBarrier 操作。如果制定了超时等待时间，则执行`Condition`的超时等待方法，让线程一直处于等待中，除非被唤醒或到达超时等待时间。

    