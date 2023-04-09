
---
title: 集合框架
linktitle: 集合框架
type: book
commentable: true
---

# Java 集合类型基础

早在 Java 2 中之前，Java 就提供了特设类。比如：Dictionary, Vector, Stack, 和 Properties 这些类用来存储和操作对象组。譬如在 Java 中的数据结构主要包括以下几种接口和类：

- 枚举（Enumeration）：枚举（Enumeration）接口虽然它本身不属于数据结构,但它在其他数据结构的范畴里应用很广。枚举（The Enumeration）接口定义了一种从数据结构中取回连续元素的方式。例如，枚举定义了一个叫 nextElement 的方法，该方法用来得到一个包含多元素的数据结构的下一个元素。

- 位集合（BitSet）：位集合类实现了一组可以单独设置和清除的位或标志。该类在处理一组布尔值的时候非常有用，你只需要给每个值赋值一"位"，然后对位进行适当的设置或清除，就可以对布尔值进行操作了。

- 向量（Vector）：向量（Vector）类和传统数组非常相似，但是 Vector 的大小能根据需要动态的变化。和数组一样，Vector 对象的元素也能通过索引访问。使用 Vector 类最主要的好处就是在创建对象的时候不必给对象指定大小，它的大小会根据需要动态的变化。

- 栈（Stack）：栈（Stack）实现了一个后进先出（LIFO）的数据结构。你可以把栈理解为对象的垂直分布的栈，当你添加一个新元素时，就将新元素放在其他元素的顶部。当你从栈中取元素的时候，就从栈顶取一个元素。换句话说，最后进栈的元素最先被取出。

- 字典（Dictionary）：字典（Dictionary）类是一个抽象类，它定义了键映射到值的数据结构。当你想要通过特定的键而不是整数索引来访问数据的时候，这时候应该使用 Dictionary。由于 Dictionary 类是抽象类，所以它只提供了键映射到值的数据结构，而没有提供特定的实现。

- 哈希表（Hashtable）：Hashtable 类提供了一种在用户定义键结构的基础上来组织数据的手段。例如，在地址列表的哈希表中，你可以根据邮政编码作为键来存储和排序数据，而不是通过人名。哈希表键的具体含义完全取决于哈希表的使用情景和它包含的数据。

- 属性（Properties）：Properties 继承于 Hashtable.Properties 类表示了一个持久的属性集.属性列表中每个键及其对应值都是一个字符串。Properties 类被许多 Java 类使用。例如，在获取环境变量时它就作为 System.getProperties()方法的返回值。

虽然这些类都非常有用，但是它们缺少一个核心的，统一的主题。由于这个原因，使用 Vector 类的方式和使用 Properties 类的方式有着很大不同。

# 集合框架

集合框架是一个用来代表和操纵集合的统一架构。所有的集合框架都包含如下内容：

- **接口**：是代表集合的抽象数据类型。例如 Collection、List、Set、Map 等。之所以定义多个接口，是为了以不同的方式操作集合对象
- **实现（类）**：是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：ArrayList、LinkedList、HashSet、HashMap。
- **算法**：是实现集合接口的对象里的方法执行的一些有用的计算，例如：搜索和排序。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。

集合框架被设计成要满足以下几个目标。

- 该框架必须是高性能的。基本集合（动态数组，链表，树，哈希表）的实现也必须是高效的。
- 该框架允许不同类型的集合，以类似的方式工作，具有高度的互操作性。
- 对一个集合的扩展和适应必须是简单的。

为此，整个集合框架就围绕一组标准接口而设计。你可以直接使用这些接口的标准实现，诸如：LinkedList，HashSet，和 TreeSet 等，除此之外你也可以通过这些接口实现自己的集合。

![Java 集合框架图](http://pic002.cnblogs.com/images/2012/80896/2012053020261738.gif)

从上面的集合框架图可以看到，Java 集合框架主要包括两种类型的容器，一种是集合（Collection），存储一个元素集合，另一种是映射（Map），存储键/值对映射。Collection 接口又有 3 种子类型，List、Set 和 Queue，再下面是一些抽象类，最后是具体实现类，常用的有 ArrayList、LinkedList、HashSet、LinkedHashSet、HashMap、LinkedHashMap 等等。

- Collection 接口：Collection 是最基本的集合接口，一个 Collection 代表一组 Object，即 Collection 的元素, Java 不提供直接继承自 Collection 的类，只提供继承于的子接口(如 List 和 Set)。Collection 接口存储一组不唯一，无序的对象。
- List 接口：List 接口是一个有序的 Collection，使用此接口能够精确的控制每个元素插入的位置，能够通过索引(元素在 List 中位置，类似于数组的下标)来访问 List 中的元素，第一个元素的索引为 0，而且允许有相同的元素。List 接口存储一组不唯一，有序（插入顺序）的对象。
- Set：Set 具有与 Collection 完全一样的接口，只是行为上不同，Set 不保存重复的元素。Set 接口存储一组唯一，无序的对象。
- SortedSet：继承于 Set 保存有序的集合。
- Map：Map 接口存储一组键值对象，提供 key（键）到 value（值）的映射。
- Map.Entry：描述在一个 Map 中的一个元素（键/值对）。是一个 Map 的内部类。
- SortedMap：继承于 Map，使 Key 保持在升序排列。
- Enumeration：这是一个传统的接口和定义的方法，通过它可以枚举（一次获得一个）对象集合中的元素。这个传统接口已被迭代器取代。

其中，实线边框的是实现类，比如 ArrayList，LinkedList，HashMap 等，折线边框的是抽象类，比如 AbstractCollection，AbstractList，AbstractMap 等，而点线边框的是接口，比如 Collection，Iterator，List 等。发现一个特点，上述所有的集合类，都实现了 Iterator 接口，这是一个用于遍历集合中元素的接口，主要包含 hashNext(),next(),remove() 三种方法。它的一个子接口 LinkedIterator 在它的基础上又添加了三种方法，分别是 add(),previous(),hasPrevious()。也就是说如果是先 Iterator 接口，那么在遍历集合中元素的时候，只能往后遍历，被遍历后的元素不会在遍历到，通常无序集合实现的都是这个接口，比如 HashSet，HashMap；而那些元素有序的集合，实现的一般都是 LinkedIterator 接口，实现这个接口的集合可以双向遍历，既可以通过 next()访问下一个元素，又可以通过 previous()访问前一个元素，比如 ArrayList。

    