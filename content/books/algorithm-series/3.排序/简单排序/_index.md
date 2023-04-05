
---
title: 简单排序
linktitle: 简单排序
type: book
commentable: true
---

﻿# Sorting

![](http://upload-images.jianshu.io/upload_images/273973-19cf4a1e58b6ebaf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://blog.chinaunix.net/attachment/201201/18/21457204_1326898064RUxx.jpg)

n 个数值选出最大 m 个数(3<m<n )的最小算法复杂度是 O(nlogm)。

## 排序算法稳定性

首先，排序算法的稳定性大家应该都知道，通俗地讲就是能保证排序前 2 个相等的数其在序列的前后位置顺序和排序后它们两个的前后位置顺序相同。在简单形式化一下，如果 Ai = Aj，Ai 原来在位置前，排序后 Ai 还是要在 Aj 位置前。那么保证稳定性的优势在哪呢？排序算法如果是稳定的，那么从一个键上排序，然后再从另一个键上排序，第一个键排序的结果可以为第二个键排序所用。基数排序就是这样，先按低位排序，逐次按高位排序，低位相同的元素其顺序再高位也相同时是不会改变的。另外，如果排序算法稳定，对基于比较的排序算法而言，元素交换的次数可能会少一些。

    