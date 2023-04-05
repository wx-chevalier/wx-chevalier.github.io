
---
title: scikit-image
linktitle: scikit-image
type: book
commentable: true
---

# skimage

基于 Python 脚本语言开发的数字图片处理包，比如 PIL, Pillow, opencv, scikit-image 等。
PIL 和 Pillow 只提供最基础的数字图像处理，功能有限；opencv 实际上是一个 c++库，只是提供了 python 接口，更新速度非常慢。scikit-image 是基于 scipy 的一款图像处理包，它将图片作为 numpy 数组进行处理，正好与 matlab 一样，因此，我们最终选择 scikit-image 进行数字图像处理。

skimage 包的全称是 scikit-image SciKit (toolkit for SciPy)，它对 scipy.ndimage 进行了扩展，提供了更多的图片处理功能。它是由 python 语言编写的，由 scipy 社区开发和维护。skimage 包由许多的子模块组成，各个子模块提供不同的功能。主要子模块列表如下：

```s
子模块名称　                主要实现功能
io                            读取、保存和显示图片或视频
data                       提供一些测试图片和样本数据
color                           颜色空间变换
filters             图像增强、边缘检测、排序滤波器、自动阈值等
draw               操作于numpy数组上的基本图形绘制，包括线条、矩形、圆和文本等
transform          几何变换或其它变换，如旋转、拉伸和拉东变换等
morphology          形态学操作，如开闭运算、骨架提取等
exposure              图片强度调整，如亮度调整、直方图均衡等
feature                        特征检测与提取等
measure                  图像属性的测量，如相似性或等高线等
segmentation                          图像分割
restoration                           图像恢复
util                                  通用函数
```

## PIL vs skimage

Image 读出来的是 PIL 的类型，而 skimage.io 读出来的数据是 numpy 格式的：

```py
import Image as img
import os
from matplotlib import pyplot as plot
from skimage import io,transform
#Image和skimage读图片
img_file1 = img.open('./CXR_png/MCUCXR_0042_0.png')
img_file2 = io.imread('./CXR_png/MCUCXR_0042_0.png')
```

输出可以看出 Img 读图片的大小是图片的(width, height)；而 skimage 的是(height,width, channel)。

```py
#读图片后数据的大小：
print "the picture's size: ", img_file1.size
print "the picture's shape: ", img_file2.shape

the picture's size:  (4892, 4020)
the picture's shape:  (4020, 4892)

#得到像素：
print(img_file1.getpixel((500,1000)), img_file2[500][1000])
print(img_file1.getpixel((500,1000)), img_file2[1000][500])
print(img_file1.getpixel((1000,500)), img_file2[500][1000])
(0, 139)
(0, 0)
(139, 139)
```

Img 读出来的图片获得某点像素用 getpixel((w,h))可以直接返回这个点三个通道的像素值
skimage 读出来的图片可以直接 img_file2[0][0]获得，但是一定记住它的格式，并不是你想的(channel,height,width)。

    