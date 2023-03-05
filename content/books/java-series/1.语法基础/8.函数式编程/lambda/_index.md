
---
title: Lambda
linktitle: Lambda
type: book
commentable: true
---

# Lambda

Lambda 表达式是一个带有参数和函数体的匿名函数，它本身是构造了一个继承自某个函数式接口的子类，所以可以用父类指针指向它。在 Java 中，Lambda 表达式就是闭包；闭包一般指存在自由变量的代码块，它与对象类似，都是用来描述一段代码与其环境的关系。事实上，内部类一直都是闭包，而 Java8 中为闭包赋予了更吸引人的语法。一个 Lambda 表达式包括三个部分：一段代码、参数、自由变量的值，这里的“自由”指的是那些不是参数并且没有在代码中定义的变量。Java 中本质上闭包中是采用的值捕获，即不可以在闭包中使用可变对象。但是它实际上是允许捕获事实上不变量，譬如不可变的 ArrayList，只是指针指向不可变罢了。虽然实现用的是值捕获，但效果看起来跟引用捕获一样；就算以后的 Java 扩展到允许通用的(对可变变量的)引用捕获，也不会跟已有的代码发生不兼容。

Java 中最常见的闭包的使用如下所示：

```java
Runnable task = () -> {
    // do something
};

Comparator<String> cmp = (s1, s2) -> {
    return Integer.compare(s1.length(), s2.length());
};
```

    