
---
title: Deflate 算法
linktitle: Deflate 算法
type: book
commentable: true
---

# Deflate 算法

Deflate 算法主要基于前人的两个算法，LZ77 压缩算法和 Huffman coding。总结下整个 Deflate encoding 的过程如下图所示：

![Deflate encoding 过程](https://pic.imgdb.cn/item/63a2bd9ab1fccdcd3690e820.jpg)

总结下 Deflate 中两个非常值得学习的点：

- 将 alphabet 的取值空间划分成大小不等的段，对段进行 huffman coding
- 为了最小化 huffman 码表的数据量，用 code lengths 唯一表示一颗 huffman 树

# LZ77

这里先简单介绍下 LZ77 算法，基本思想是数据中存在很多重复出现的字符串（也可以是字节流），重复的越多，可压缩的空间越大。对于这些重复出现的字符串，可以用 `<length, distance> pair` 来表示，distance 是到上一次这个字符串出现位置的距离，length 是这个重复串的长度。

这里面有几个细节：

- 重复串搜索只会在往前的一定长度范围内由近到远搜素，LZ77 称之为滑动窗口(Search Buffer)，一般这个窗口大小是 32K，滑动窗口大小决定了 distance 的取值范围。
- 除了前向用于搜索重复串的 Search buffer 外，还有个后向的 Look-ahead buffer，作为当前待编码的字符串区，因此寻找重复串的过程就是在 search buffer 里查找和当前 look-ahead buffer 最长的匹配字符串（常见的动态规划问题）。look-ahead buffer 大小决定了 length 的取值范围。
- deflate 里认为只有重复串长度超过 3 个字节，才采用这种表示方法，同时最多允许匹配 258 个字符，因此 length 的取值范围是 3-258（256 个不同的值），这个限制是在压缩率和算法计算复杂度间做权衡。

encoding 的伪代码如下：

```s
while look-ahead buffer is not empty
    go backwards in search buffer to find longest match of the look-ahead buffer
    if match found
        print: (offset from window boundary, length of match);
        shift window by length;
    else
        print: first symbol in look-ahead buffer;
        shift window by 1;
    fi
end while
```

可以看出 encoding 过程需要做个最长匹配字符串的查找，也可以选择合适的数据结构来表示 search buffer/look-ahead buffer 来加速查找。encoding 的输出是个 token stream，token 可以是 `<length, distance>` 也可以是 symbol 本身。
decoding 的伪代码：

```s
for each token (<length, distance>  or symbol)
    if token is symbol
        then print symbol;
    else
        go reverse in previous output by offset characters and copy character wise for length symbols; print symbol;
    fi
next
```

# Huffman coding

哈夫曼编码应该不需要多做介绍了，每个学过数据结构的都具备这个知识。recap 下 Huffman coding 是一种前缀编码，根据统计每个字符在整个待编码数据中出现的次数，从小到大排序，由底向上动态构建一颗二叉树，二叉树的叶子节点就是每个字符，出现次数越小的字符处于二叉树的底部，对应的码字的长度也越长。这样构建的二叉树就是 huffman 树，整个字符集以及其对应的码字构成整个码表。由于码表是根据要编码的数据动态生成的，想要解码必须要有这个码表，因此码表需要和数据一起传输。

需要说明的是同一个数据集在经典的 huffman 算法下，可以有多棵 huffman 树存在，因为节点位于二叉树的左边还是右边对最终的编码长度来说没有影响，有影响的只是节点位于树的哪层（也就是字符在被编码后的 bit 长度，也被称为 code length）。可以这么说：对于如果两个码表中码字的 code length 一致的话，那么这两个码表最终的编码效果也是一致的。因此，在 deflate 算法中，为了最大化减少传输码表所占用的数据量，在构建 huffman 树时对树的形状做了两个限制，使得同一个数据集唯一生成一颗 huffman 树，与此同时，在传输码表的时候只需要传输字符和其对应的 code length 就要可以了。 这两个限制也很简单：

- 当叶子节点和一个中间节点构建二叉树时将叶子节点放在左边，中间节点放右边。
- 当两个叶子节点构建二叉树时，将先出现的字符的节点放左边，后出现的放右边。

这样构建出的二叉树越靠左边树越浅，越靠右边树越深，极为不平衡，特殊且唯一。

# Deflate 中 LZ77 和 huffman coding 怎么结合起来

总的来说，Deflate 先应用 LZ77 压缩策略对原始数据进行压缩，得到(<length, distance> or literal) 流，然后应用 huffman coding 对 distance、length、literal 分别进行编码得到最终的压缩数据流。应用 LZ77 的过程没啥好说的了，比较 trick 的是应用 huffman coding 的过程。

## 对 distance 的 huffman coding

前面我们知道 distance 的取值范围取决于 search buffer 的大小，32K 的 search buffer 对于 distance 的取值范围为 1-32768，也就是说 distance 码表中最多可能有 32768 个码表，我们知道 huffman 树的高度在最坏情况下渐近于码表大小。要知道 Deflate 诞生于上世纪 90 年代，那个以 KB 计算内存的时代内存是非常宝贵的，直接应用经典 huffman 算法构建 huffman 树时对内存的消耗、计算量的要求很容易就超出当时的硬件条件。因此 Deflate 算法做了个很牛逼的优化——将 distance 的 value space 划分为 30 个变长的段，然后对这 30 个段进行 huffman coding，段内根据段区间大小进行等长编码。具体如下：

![哈夫曼编码](https://pic.imgdb.cn/item/63a2bccab1fccdcd368f850d.jpg)

其中 code 是段的编号，bits 表示该段的区间长度。可以看出，distance 1,2,3,4 这四个特殊的 distance 没有划分，一个 distance 值占用一个段，distance 值越大，段划分的越稀疏，这样做的理由是考虑到重复串出现的空间局部性。举个具体的例子，假设 17-24 这个 distance 段的 huffman coding 是二进制的 110，那么 distance 17-24 最终的 coding 为：

```s
17-->110 000

18-->110 001

19-->110 010

20-->110 011

21-->110 100

22-->110 101

23-->110 110

24-->110 111
```

Deflate 通过这样的方式在码表长度和算法的计算复杂度之间做了 trade off。

## 对 literal/length 的 huffman coding

literal 就是原始数据中的一个个字符（字节），所以一个 literal 的取值范围是 0-255（256 种不同的取值）。length 前面说了，取值范围是 3-258（也是 256 个不同的取值）。Deflate 在这里比较 trick 地将 literal 值、length 值、以及数据块结束标识全部统一到一个 alphabet 中进行编码，得到也是同一个码表。这样做的好处是不需要在最终的编码中用一个标识位来标识当前编码的类型（是 literal 还是 length 或者是块结束标识）。当然也有代价，代价就是 huffman 树变大了。Deflate 对 literal 取值分布没有做任何假设，但对 length 的取值做了和 distance 类似的假设，即 length 越大意味这字符串匹配的长度越长，出现的概率越小，因此 Deflate 对 length 的 value space 做了类似 distance 的分段处理，将 256 种取值划分为 29 个区间段。如下表所示：

![](https://pic.imgdb.cn/item/63a2bccab1fccdcd368f850d.jpg)

细心的读者会发现，285 这个 length 的 bits 是 0，意味着 285 作为一个独立的段参与 huffman coding 中，为什么？我猜测是由于 285 作为 Deflate 规定的最大匹配串长度，也就说所有超过 285 的匹配字符串长度都被截断到 285 了，因此其出现的概率会相对高些。OK，这里暂停总结下目前为止 Defate 算法的编码过程： 首先应用 LZ77 算法对原始数据进行压缩，生成(<length, distance> or literal)数据流，然后对数据流应用 huffman coding 算法进行统计分析，生成了两个 huffman 码表，一个是 literal/length 构成的 alphabet 所生成的码表（简称为码表 1)，一个是 distance 值构成的 alphabet 所生成的码表（简称为码表 2），再由这两个码表对(<length, distance> or literal)数据流进行编码得到最终的数据码流。

解码过程就是上面的逆过程，假设已经重建好码表 1 和码表 2，首先应用码表 1 对数据流进行解码，如果发现是 literal 则直接输出，如果是 length，继续用码表 2 对 length 后面的 distance 进行解码，得到<length, distance> pair，最终将生成的(<length, distance> or literal) 数据流交给 LZ77 解码得到原始数据。进度条到这里已经过半了，但是故事还没有结束，前面说过码表本身需要和压缩的数据流一起来传输/存储，下面继续 Deflate 算法对码表本身的处理。

## 对 huffman 码表本身的 encoding

前面提到，Deflate 选择构建一颗最特殊的 huffman 树（最左倾的树）来进行 huffman 编码，这样码表可以用字符以及其对应的 code length 来唯一表示，大大缩小了码表的数据量。以 literal/length 码表为例，整个 alphabet 大小是 286（256 个 literal + 1 个块结束标识 + 29 个 length 段），因此整个码表可以用长度为 286 个 code length 序列来表示，每个 code length 唯一对应一个 alphabet 中的字符。Distance 码表也一样，可以用一个长度为 30 的 code length 序列唯一表示。通常来说这两个 code length 序列越往后 code length 值为 0 的可能性就越大，0 意味着 alphabet 中没有对应的元素（字符）。所以在这里 Deflate 用了一个小的 trick，它将这两个 code length 序列 trim 一下，把 trailing 的那些 0 都去掉，然后把他们合并称一个 code length 序列。由于事先知道这两个序列的原始长度，根据经过 trim 再合并得到的这个 code length 完全能还原出原始的两个 code length 序列。

可以看出这个序列中依旧会出现很多连续的 0，或者 1 等等 code length 的存在。Deflate 意识到这点，所以会先对这个 code length 序列做一次 run length encoding，也就是游程编码。在构建 huffman 树的时候，Deflate 其实还对生成树的高度加了限制，使得 huffman 树的高度不超过 15，因此这个 code length 序列的取值范围是 0-15。在经过游程编码后序列会进一步压缩成，姑且称这个经过游程编码后的序列为 MCL，MCL 的长度肯定小于(286 + 30)，MCL 序列中元素的取值范围是 0-18(游程编码会引入 16、17、18) 几个特殊字符。

Deflate 对 MCL 再进行一次 huffman coding，同时限制生成的 huffman 树高度最多为 7，得到一个编码后 MCL 数据流，以及一个 MCL huffman 码表，对于这个 MCL huffman 码表，采用和前面一致的 code length 表示法，由于这个码表的 alphabet 大小只有 19 个，Deflate 认为差不多就得了，用固定长度编码对 RSQ 码表的 code lengths 进行编码。值得说明的是，针对这个 alphabet Deflate 按照如下的顺序记录他们的 code length：

```s
16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
```

采用这个特殊顺序记录 code length 的原因是为了能让 0 尽可能出现在 code length 序列的尾部（16,17,18 是游程编码进入的特殊字符，所以出现的频率可能会高些，所以放前面）。这样以来可以对 code length 进行 trim 操作，去掉 trailing 的 0，然后记录下原来 code length 序列长度（alphabet 大小）解码的时候就能够正确恢复。

    