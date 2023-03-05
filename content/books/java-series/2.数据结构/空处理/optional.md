
---
title: Optional
linktitle: Optional
type: book
commentable: true
---

# Optional

空指针确实会产生很多问题，我们经常遇到空的引用，然后又想从这个空的引用上去获取其他的值，接着理所当然的碰到了 NullPointException。为了解决上面的问题，在 Java SE8 中引入了一个新类 java.util.Optional，这个类可以缓解上面的问题。

Optional 是一个简单的值容器，这个值可以是 null，也可以是 non-null。考虑到一个方法可能会返回一个 non-null 的值，也可能返回一个空值。为了不直接返回 null，我们在 Java 8 中就返回一个 Optional。

```java
Optional<String> optional = Optional.of("bam");

optional.isPresent();           // true
optional.get();                 // "bam"
optional.orElse("fallback");    // "bam"

optional.ifPresent((s) -> System.out.println(s.charAt(0)));     // "b"
```

Optional 类的的使用只是提示你这里可能存在空值，需要特殊处理，并提供了一些特殊处理的方法。如果你把 Optional 类当作空指针的救命稻草而不加思考的使用，那么依旧会碰到错误。

# Optional 创建

Optional 的创建一共有三种方式。

```java
@Test
public void createOptionalTest() {
    // Optional 构造方式1 - of 传入的值不能为 null
    Optional<String> helloOption = Optional.of("hello");

    // Optional 构造方式2 - empty 一个空 optional
    Optional<String> emptyOptional = Optional.empty();

    // Optional 构造方式3 - ofNullable 支持传入 null 值的 optional
    Optional<String> nullOptional = Optional.ofNullable(null);
}
```

其中构造方式 1 中 of 方法，如果传入的值会空，会报出 NullPointerException 异常。

# Optional 判断

Optional 只是一个包装对象，想要判断里面有没有值可以使用 isPresent 方法检查其中是否有值。

```java
@Test
public void checkOptionalTest() {
    Optional<String> helloOptional = Optional.of("Hello");
    System.out.println(helloOptional.isPresent());

    Optional<Object> emptyOptional = Optional.empty();
    System.out.println(emptyOptional.isPresent());
}
```

从 JDK11 开始，提供了 isEmpty 方法用来检查相反的结果：是否为空。如果想要在有值的时候进行一下操作。可以使用 ifPresent 方法。

```java
@Test
public void whenIsPresent() {
    // 如果没有值，获取默认值
    Optional<String> helloOptional = Optional.of("Hello");
    Optional<String> emptyOptional = Optional.empty();
    helloOptional.ifPresent(s -> System.out.println(s.length()));
    emptyOptional.ifPresent(s -> System.out.println(s.length()));
}
```

# Optional 获取值

使用 `get`方法可以获取值，但是如果值不存在，会抛出 `NoSuchElementException` 异常。

```java
@Test
public void getTest() {
    Optional<String> stringOptional = Optional.of("hello");
    System.out.println(stringOptional.get());
    // 如果没有值，会抛异常
    Optional<String> emptyOptional = Optional.empty();
    System.out.println(emptyOptional.get());
}
```

得到结果：

```
hello

java.util.NoSuchElementException: No value present
    at java.util.Optional.get(Optional.java:135)
    at net.codingme.feature.jdk8.Jdk8Optional.getTest(Jdk8Optional.java:91)
```

# Optional 默认值

使用 `orElse`, `orElseGet` 方法可以在没有值的情况下获取给定的默认值。

```
@Test
public void whenIsNullGetTest() {
    // 如果没有值，获取默认值
    Optional<String> emptyOptional = Optional.empty();
    String orElse = emptyOptional.orElse("orElse default");
    String orElseGet = emptyOptional.orElseGet(() -> "orElseGet default");
    System.out.println(orElse);
    System.out.println(orElseGet);
}
```

得到的结果：

```
orElse default
orElseGet default
```

看到这里你可能会有些疑惑了，这两个方法看起来效果是一模一样的，为什么会提供两个呢？下面再看一个例子，你会发现两者的区别。

```
@Test
public void orElseAndOrElseGetTest() {
    // 如果没有值，默认值
    Optional<String> emptyOptional = Optional.empty();
    System.out.println("空Optional.orElse");
    String orElse = emptyOptional.orElse(getDefault());
    System.out.println("空Optional.orElseGet");
    String orElseGet = emptyOptional.orElseGet(() -> getDefault());
    System.out.println("空Optional.orElse结果："+orElse);
    System.out.println("空Optional.orElseGet结果："+orElseGet);
    System.out.println("--------------------------------");
    // 如果没有值，默认值
    Optional<String> stringOptional = Optional.of("hello");
    System.out.println("有值Optional.orElse");
    orElse = stringOptional.orElse(getDefault());
    System.out.println("有值Optional.orElseGet");
    orElseGet = stringOptional.orElseGet(() -> getDefault());
    System.out.println("有值Optional.orElse结果："+orElse);
    System.out.println("有值Optional.orElseGet结果："+orElseGet);
}

public String getDefault() {
    System.out.println("   获取默认值中..run getDeafult method");
    return "hello";
}
```

得到的输出：

```
空Optional.orElse
   获取默认值中..run getDeafult method
空Optional.orElseGet
   获取默认值中..run getDeafult method
空Optional.orElse结果：hello
空Optional.orElseGet结果：hello
--------------------------------
有值Optional.orElse
   获取默认值中..run getDeafult method
有值Optional.orElseGet
有值Optional.orElse结果：hello
有值Optional.orElseGet结果：hello
```

在这个例子中会发现 `orElseGet` 传入的方法在有值的情况下并不会运行。而 `orElse`却都会运行。

# Optional 异常

使用 `orElseThrow` 在没有值的时候抛出异常

```
/**
 * 如果没有值，抛出异常
 */
@Test
public void whenIsNullThrowExceTest() throws Exception {
    // 如果没有值，抛出异常
    Optional<String> emptyOptional = Optional.empty();
    String value = emptyOptional.orElseThrow(() -> new Exception("发现空值"));
    System.out.println(value);
}
```

得到结果：

```
java.lang.Exception: 发现空值
    at net.codingme.feature.jdk8.Jdk8Optional.lambda$whenIsNullThrowExceTest$7(Jdk8Optional.java:118)
    at java.util.Optional.orElseThrow(Optional.java:290)
    at net.codingme.feature.jdk8.Jdk8Optional.whenIsNullThrowExceTest(Jdk8Optional.java:118)
```

# Optional 函数接口

`Optional` 随 JDK8 一同出现，必然会有一些 JDK8 中的新特性，比如函数接口。`Optional` 中主要有三个传入函数接口的方法，分别是`filter`，`map`，`flatMap`。这里面的实现其实是 JDK8 的另一个新特性了，因此这里只是简单演示，不做解释。后面放到其他 JDK8 新特性文章里介绍。

```java
@Test
public void functionTest() {
    // filter 过滤
    Optional<Integer> optional123 = Optional.of(123);
    optional123.filter(num -> num == 123).ifPresent(num -> System.out.println(num));

    Optional<Integer> optional456 = Optional.of(456);
    optional456.filter(num -> num == 123).ifPresent(num -> System.out.println(num));

    // map 转换
    Optional<Integer> optional789 = Optional.of(789);
    optional789.map(String::valueOf).map(String::length).ifPresent(length -> System.out.println(length));
}
```

得到结果：

```
123
3
```

# 案例

假设有计算机、声卡、usb 三种硬件（下面的代码中使用了 `Lombok` 的 `@Data` 注解）。

```java
/**
 * 计算机
 */
@Data
class Computer {
    private Optional<SoundCard> soundCard;
}

/**
 * 声卡
 */
@Data
class SoundCard {
    private Optional<Usb> usb;
}

/**
 * USB
 */
@Data
class Usb {
    private String version;
}
```

计算机可能会有声卡，声卡可能会有 usb。那么怎么取得 usb 版本呢？

```java
/**
 * 电脑里【有可能】有声卡
 * 声卡【有可能】有USB接口
 */
@Test
public void optionalTest() {
    // 没有声卡，没有 Usb 的电脑
    Computer computerNoUsb = new Computer();
    computerNoUsb.setSoundCard(Optional.empty());
    // 获取 usb 版本
    Optional<Computer> computerOptional = Optional.ofNullable(computerNoUsb);
    String version = computerOptional.flatMap(Computer::getSoundCard).flatMap(SoundCard::getUsb)
        .map(Usb::getVersion).orElse("UNKNOWN");
    System.out.println(version);
    System.out.println("-----------------");

    // 如果有值，则输出
    SoundCard soundCard = new SoundCard();
    Usb usb = new Usb();
    usb.setVersion("2.0");
    soundCard.setUsb(Optional.ofNullable(usb));
    Optional<SoundCard> optionalSoundCard = Optional.ofNullable(soundCard);
    optionalSoundCard.ifPresent(System.out::println);
    // 如果有值，则输出
    if (optionalSoundCard.isPresent()) {
        System.out.println(optionalSoundCard.get());
    }

    // 输出没有值，则没有输出
    Optional<SoundCard> optionalSoundCardEmpty = Optional.ofNullable(null);
    optionalSoundCardEmpty.ifPresent(System.out::println);
    System.out.println("-----------------");

    // 筛选 Usb2.0
    optionalSoundCard.map(SoundCard::getUsb)
            .filter(usb1 -> "3.0".equals(usb1.map(Usb::getVersion)
            .orElse("UBKNOW")))
            .ifPresent(System.out::println);
}
```

得到结果：

```
UNKNOWN
-----------------
SoundCard(usb=Optional[Usb(version=2.0)])
SoundCard(usb=Optional[Usb(version=2.0)])
-----------------
```

# Links

- [Java 8 Optional 类深度解析](http://www.importnew.com/6675.html)
- [Optional Improvements in Java 9](http://iteratrlearning.com/java9/2016/09/05/java9-optional.html)

    