
---
title: 神经网络
linktitle: 神经网络
type: book
commentable: true
---

# Neural Network

# Activation Function | 激活函数

## Sigmod

神经网络中的激活函数，其作用就是引入非线性。具体的非线性形式，则有多种选择。sigmoid 的优点在于输出范围有限，所以数据在传递的过程中不容易发散。当然也有相应的缺点，就是饱和的时候梯度太小。sigmoid 还有一个优点是输出范围为 (0, 1)，所以可以用作输出层，输出表示概率。Sigmoid 函数是一个在生物学中常见的 S 型的函数，也称为 S 形生长曲线。Sigmoid 函数由下列公式定义:

$$ S(x) = \frac{1}{1+ e^{-x}} $$

Geoff Hinton covered exactly this topic in his coursera course on neural nets. The problem with sigmoids is that as you reach saturation (values get close to 1 or 0), the gradients vanish. This is detrimental to optimization speed. Softmax doesn't have this problem, and in fact if you combine softmax with a cross entropy error function the gradients are just (z-y), as they would be for a linear output with least squares error.

其导数 $f'(x)=f(x)\*[1-f(x)]$，可以节约计算时间

# Links

- https://www.zhihu.com/question/314879954/answer/638380202

    