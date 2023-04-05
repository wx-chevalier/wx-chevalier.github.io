
---
title: TDD
linktitle: TDD
type: book
commentable: true
---

# 测试驱动开发（Test Driven Development）

测试驱动开发的基本思想就是在开发功能代码之前，先编写测试代码。也就是说在明确要开发某个功能后，首先思考如何对这个功能进行测试，并完成测试代码的编写，然后编写相关的代码满足这些测试用例。然后循环进行添加其他功能，直到完全部功能的开发。我们这里把这个技术的应用领域从代码编写扩展到整个开发过程。应该对整个开发过程的各个阶段进行测试驱动，首先思考如何对这个阶段进行测试、验证、考核，并编写相关的测试文档，然后开始下一步工作，最后再验证相关的工作。下图是一个比较流行的测试模型：V 测试模型。

Test-Driven Development (TDD) is a technique for building software that guides software development by writing tests. It was developed by [Kent Beck](https://twitter.com/KentBeck) in the late 1990's as part of Extreme Programming. In essence you follow three simple steps repeatedly:

- Write a test for the next bit of functionality you want to add.
- Write the functional code until the test passes.
- Refactor both new and old code to make it well structured.

You continue cycling through these three steps, one test at a time, building up the functionality of the system. Writing the test first, what [XPE2](http://www.amazon.com/gp/product/0321278658?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321278658)![](http://www.assoc-amazon.com/e/ir?t=martinfowlerc-20&l=as2&o=1&a=0321601912) calls Test-First Programming, provides two main benefits. Most obviously it's a way to get [SelfTestingCode](http://martinfowler.com/bliki/SelfTestingCode.html), since you can only write some functional code in response to making a test pass. The second benefit is that thinking about the test first forces you to think about the interface to the code first. This focus on interface and how you use a class helps you separate interface from implementation.

The most common way that I hear to screw up TDD is neglecting the third step. Refactoring the code to keep it clean is a key part of the process, otherwise you just end up with a messy aggregation of code fragments. (At least these will have tests, so it's a less painful result than most failures of design.)

## Further Reading

The best book for getting started with TDD is Kent Beck's [Test-Driven Development](http://www.amazon.com/gp/product/0321146530?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321146530)![](http://www.assoc-amazon.com/e/ir?t=martinfowlerc-20&l=as2&o=1&a=0321601912).

For online resources a good place to start is the [TDD chapter](http://www.jamesshore.com/Agile-Book/test_driven_development.html) of James Shore's Art of Agile Development. James also writes aseries of screencasts called [Let's Play TDD](http://www.jamesshore.com/Blog/Lets-Play)

# 连接

- [谈“测试驱动的开发”](http://www.yinwang.org/blog-cn/2013/04/07/test-driven-dev)

    