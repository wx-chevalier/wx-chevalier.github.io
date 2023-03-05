
---
title: 张量与 AutoGraph
linktitle: 张量与 AutoGraph
type: book
commentable: true
---

# 张量与 AutoGraph

首先，我们导入 TensorFlow。由于名称有点长，我们经常使用短别名 tf 导入它。

```py
import tensorflow as tf
```

张量表示数值的数组（可能是多维数组），在一个轴上，张量对应于（在数学上）矢量，在两个轴上，张量对应于一个矩阵；具有两个以上轴的张量没有特殊的数学名称。首先，我们可以使用 arange 创建一个行向量 x，该行向量 x 包含从 0 开始的前 12 个整数，尽管默认情况下它们创建为浮点数。张量中的每个值都称为张量的元素。例如，张量 x 中有 12 个元素。除非另有说明，否则新张量将存储在主存储器中，并指定用于基于 CPU 的计算。

```py
x = tf.range(12)
x
<tf.Tensor: shape=(12,), dtype=int32, numpy=array([ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11], dtype=int32)>
```

我们可以通过检查张量的 shape 属性来访问张量的形状（沿每个轴的长度）。

```py
x.shape

TensorShape([12])
```

If we just want to know the total number of elements in a tensor, i.e., the product of all of the shape elements, we can inspect its size. Because we are dealing with a vector here, the single element of its shape is identical to its size.

```py
tf.size(x)

<tf.Tensor: shape=(), dtype=int32, numpy=12>
```

    