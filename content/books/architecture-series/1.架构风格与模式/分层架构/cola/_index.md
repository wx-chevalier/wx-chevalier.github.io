
---
title: COLA
linktitle: COLA
type: book
commentable: true
---

# COLA

COLA 是由阿里开源的业务架构风格，COLA 是 Clean Object-Oriented and Layered Architecture 的缩写，代表“整洁面向对象分层架构”，也叫“可乐”架构。在架构思想上，COLA 主张像六边形架构那样，使用端口-适配器去解耦技术细节；主张像洋葱圈架构那样，以领域为核心，并通过依赖倒置反转领域层的依赖方向。最终形成如下图所示的组件关系。

![](https://i.postimg.cc/9QPNbzm9/image.png)

换一个视角，从 COLA 应用处理响应一个请求的过程来看。COLA 使用了 CQRS 来分离命令和查询的职责，使用扩展点和元数据来提升应用的扩展性。

![](https://i.postimg.cc/V6RgkjQT/image.png)

# 业务扩展

对于只有一个业务的简单场景，对扩展性的要求并不突出，这也是为什么扩展设计常被忽略的原因，因为我们大部分的系统都是从单一业务开始的。但是随着业务场景越来越复杂，代码里面开始出现大量的 if-else 逻辑。此时除了常规的策略模式以外，我们可以考虑在架构层面提供统一的扩展解决方案。

![](https://i.postimg.cc/v89jT0JX/image.png)

在扩展设计中，我们提炼出两个重要的概念，一个是业务身份，另一个是扩展点：

- 业务身份是指业务在系统唯一标识一个业务或者一个场景的标志。在具体实现中，我们使用 BizCode 来表示业务身份，其中 BizCode 采用类似 Java 包名命名空间的方式。例如，我们可以用“ali.tmall”表示阿里天猫业务，用“ali.tmall.car” 表示阿里天猫的汽车业务，而用"ali.tmall.car.aftermarket"代表这是阿里天猫的汽车业务的后市场场景。

- 每个业务或者场景都可以实现一个或多个扩展点（ExtensionPoint），也就是说一个业务身份加上一个扩展点，可以唯一地确定一个扩展实现（Extension）。而这个业务身份和扩展点的组合，我们将其称之为扩展坐标（ExtensionCoordinate），如下图所示。

这样，通过业务身份+扩展点，我们就可以从框架层面实现对不同租户，不同业务，不同场景的扩展定制了。整个阿里业务中台正是基于这个思想，实现的多业务支撑的。

    