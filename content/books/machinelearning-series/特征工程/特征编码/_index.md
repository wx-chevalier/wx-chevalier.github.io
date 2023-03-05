
---
title: 特征编码
linktitle: 特征编码
type: book
commentable: true
---

# Feature Encoding

# Feature Extraction(特征抽取)

## TF-IDF

ＴＦ／ＩＤＦ(term frequency/inverse document frequency) 的概念被公认为信息检索中最重要的发明。TF-IDF 比较典型的应用是在搜索引擎与文档分类中，用于描绘某个词所在特征维度的权重。譬如当我们搜索"原子能的应用"，这个包含了"原子能"与"应用"两个关键词的句式时(已经忽略了停止词：的)，要寻找与其最接近的网页，即是寻找这个查询语句或者待分类文档与已分类文档之间的相关性。概括地讲，如果一个查询包含关键词$w_1,w_2,...,w_N$, 它们在一篇特定网页中的词频分别是: $TF_1, TF_2, ..., TF_N$。(TF: term frequency)。那么，这个查询和该网页的相关性就是:$$TF_1 + TF_2 + ... + TF_N$$。
在汉语中，“应用”是个很通用的词，而“原子能”是个很专业的词，后者在相关性排名中比前者重要。因此我们需要给汉语中的每一个词给一个权重，这个权重的设定必须满足下面两个条件：

1. 一个词预测主题能力越强，权重就越大，反之，权重就越小。我们在网页中看到“原子能”这个词，或多或少地能了解网页的主题。我们看到“应用”一次，对主题基本上还是一无所知。因此，“原子能“的权重就应该比应用大。
2. 应删除词的权重应该是零。
   如果一个关键词只在很少的网页中出现，我们通过它就容易锁定搜索目标，它的权重也就应该大。反之如果一个词在大量网页中出现，我们看到它仍 然不很清楚要找什么内容，因此它应该小。概括地讲，假定一个关键词 ｗ 在 Ｄｗ 个网页中出现过，那么 Ｄｗ 越大，ｗ 的权重越小，反之亦然。在信息检索中，使用最多的权重是“逆文本频率指数” (Inverse document frequency 缩写为ＩＤＦ)，它的公式为ｌｏｇ(Ｄ／Ｄｗ)其中Ｄ是全部网页数。比如，我们假定中文网页数是Ｄ＝１０亿，应删除词“的”在所有的网页中都出现，即 Ｄｗ＝１０亿，那么它的ＩＤＦ＝ log(10 亿/10 亿)= log (1) = ０。假如专用词“原子能”在两百万个网页中出现，即Ｄｗ＝２００万，则它的权重ＩＤＦ＝ log(500) =6.2。又假定通用词“应用”，出现在五亿个网页中，它的权重ＩＤＦ = log(2)
   则只有 0.7。也就只说，在网页中找到一个“原子能”的比配相当于找到九个“应用”的匹配。利用 IDF，上述相关性计算个公式就由词频的简单求和变成了加权求和，即 TF1*IDF1 +　 TF2*IDF2 ＋... + TFN\*IDFN。在上面的例子中，该网页和“原子能的应用”的相关性为 0.0161，其中“原子能”贡献了 0.0126，而“应用”只贡献了 0.0035。这个比例和我们的直觉比较一致了。
   其实 IDF 的概念就是一个特定条件下、关键词的概率分布的交叉熵(Kullback-Leibler Divergence)

### 数学原理

一个查询(Query)中每一个关键词(Key Word)$w$的权重应该反映这个词对查询来讲提供了多少的信息。最简单的办法就是用每个词的信息量作为它的权重：

$$
I(w) = -P(w)logP(w) = -\frac{TF(w)}{N}log\frac{TF(w)}{N} = \frac{TF(w)}{N}log\frac{N}{TF(w)}
$$

其中$N$是整个语料库的大小，是个可以省略的常数。而$TF(w)$是整个文档中某个词的词频，换言之，在上述公式中并没有将不同词汇在不同文档中的出现频次的差异考虑进去。公式可以简化为：
$$I(w)=TF(w)log\frac{N}{TF(w)}$$
显而易见，如果两个词的 TF 频率一致，但是一个是某几篇特定文章中的常见词，而另一个是均匀分散在多篇文章中的，那么前者的权重应该更大一点。在推导出新公式之前，首先进行一些假设：

- 每个文献大小基本相同，均为 M 个词，即$$M=\frac{N}{D}=\frac{\sum_w{TF(w)}}{D}$$
- 每个关键词一旦出现，则次数均等，即某个关键词在所有包含它的文档中出现的次数相等。则每个关键词出现$$c(w) = \frac{TF(w)}{D(w)}$$次。

那么可以得到:

$$
\frac{TF(w)}{N} log \frac{N}{TF(w)} = \frac{TF(w)}{N}log\frac{MD}{c(w)D(w)}=
\frac{TF(w)}{N}log( \frac{D}{D(w)} \frac{M}{c(w)})
$$

根据该公式，可以推导出 TF-IDF 公式的另一个表述：

$$
TF-IDF(w)=I(w)-TF(w)log(\frac{M}{c(w)})
$$

可以看出一个词的信息量$I(w)$越多，TF-IDF 值越大；同时$w$命中的文献中$w$平均出现的次数越多，第二项越小，TF-IDF 也越大。这些结论和信息论完全等同。

## StandardScaler

# Feature Selection(特征选择)

# PCA

# Transform

## [Normalizer](http://spark.apache.org/docs/latest/mllib-feature-extraction.html#normalizer)

# Association Rule Learning Algorithms

![Assoication Rule Learning Algorithms](http://3qeqpr26caki16dnhd19sv6by6v.wpengine.netdna-cdn.com/wp-content/uploads/2013/11/Assoication-Rule-Learning-Algorithms.png)

Association rule learning are methods that extract rules that best explain observed relationships between variables in data.

These rules can discover important and commercially useful associations in large multidimensional datasets that can be exploited by an organisation.

The most popular association rule learning algorithms are:

- Apriori algorithm
- Eclat algorithm

    