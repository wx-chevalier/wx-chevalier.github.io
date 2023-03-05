
---
title: sigmoid
linktitle: sigmoid
type: book
commentable: true
---

# sigmoid 函数

sigmoid 函数可以将元素的值变换到 0 和 1 之间：

$$
\operatorname{sigmoid}(x)=\frac{1}{1+\exp (-x)}
$$

sigmoid 函数在早期的神经网络中较为普遍，但它目前逐渐被更简单的 ReLU 函数取代。

![](https://i.postimg.cc/k4nYPfRz/image.png)

依据链式法则，sigmoid 函数的导数为：

$$
\text { sigmoid }^{\prime}(x)=\operatorname{sigmoid}(x)(1-\operatorname{sigmoid}(x))
$$

    