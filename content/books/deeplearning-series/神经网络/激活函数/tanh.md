
---
title: tanh
linktitle: tanh
type: book
commentable: true
---

# tanh 函数

tanh（双曲正切）函数可以将元素的值变换到-1 和 1 之间：

$$
\tanh (x)=\frac{1-\exp (-2 x)}{1+\exp (-2 x)}
$$

我们接着绘制 tanh 函数。当输入接近 0 时，tanh 函数接近线性变换。虽然该函数的形状和 sigmoid 函数的形状很像，但 tanh 函数在坐标系的原点上对称。

![](https://i.postimg.cc/15LW39Np/image.png)

依据链式法则，tanh 函数的导数：

$$
\tanh ^{\prime}(x)=1-\tanh ^{2}(x)
$$

    