
---
title: 48-全连接卷积神经网络（FCN）
linktitle: 48-全连接卷积神经网络（FCN）
type: book
commentable: true
---

## 48.全连接卷积神经网络（FCN）

- [48.全连接卷积神经网络（FCN）](#48全连接卷积神经网络fcn)
- FCN 是深度神经网络来做语义分割的奠定性工作，现在用的不多了
- 他用**转置卷积层**来替换 CNN 最后的全连接层（还有池化层），从而实现每个像素的预测。（如果输入的图片是 224 x 224，经过 CNN 变成 7 x 7，经过 transposed conv，可以还原到 224 x 224 x k，k 为通道数）

<div align="center">
  <img src="https://assets.ng-tech.icu/book/DeepLearning-MuLi-Notes/imgs/48/48-01.png" alt="image" align="center" width=500 />
</div>

- 代码

  - 见 code

    