
---
title: 2.Scikit
linktitle: 2.Scikit
type: book
commentable: true
---

# Introduction

scikit-learn 是 Python 的一个开源机器学习模块，它建立在 NumPy，SciPy 和 matplotlib 模块之上。值得一提的是，scikit-learn 最先是由 David Cournapeau 在 2007 年发起的一个 Google Summer of Code 项目，从那时起这个项目就已经拥有很多的贡献者了，而且该项目目前为止也是由一个志愿者团队在维护着。scikit-learn 最大的特点就是，为用户提供各种机器学习算法接口，可以让用户简单、高效地进行数据挖掘和数据分析。scikit-learn 主页：[scikit-learn homepage](http://scikit-learn.org/dev/)

- Numpy 是以矩阵为基础的数学计算模块，纯数学。
- Scipy 基于 Numpy，科学计算库，有一些高阶抽象和物理模型。比方说做个傅立叶变换，这是纯数学的，用 Numpy；做个滤波器，这属于信号处理模型了，在 Scipy 里找。
- Pandas 提供了一套名为 DataFrame 的数据结构，比较契合统计分析中的表结构，并且提供了计算接口，可用 Numpy 或其它方式进行计算。
- sklearn 是机器学习的算法库

# Quick Start

笔者推荐使用 Anaconda 进行安装，最方便的方式就是使用 Docker：

```
docker pull rothnic/anaconda-notebook
docker run -p 8888:8888 -i -t rothnic/anaconda-notebook
```

# DataSets

scikit-learn 内包含了常用的机器学习数据集，比如做分类的[iris](https://en.wikipedia.org/wiki/Iris_flower_data_set)和[digit](http://archive.ics.uci.edu/ml/datasets/Pen-Based+Recognition+of+Handwritten+Digits)数据集，用于回归的经典数据集[Boston house prices](http://archive.ics.uci.edu/ml/datasets/Housing)。

## iris

数据都是以 n 维(n 个特征)矩阵形式存放和展现，iris 数据中每个实例有 4 维特征，分别为：sepal length、sepal width、petal length 和 petal width。显示 iris 数据：

```
[[ 5.1  3.5  1.4  0.2]
 [ 4.9  3.   1.4  0.2]
　　　　... ...
 [ 5.9  3.   5.1  1.8]]
```

如果是对于监督学习，比如分类问题，数据中会包含对应的分类结果，其存在.target 成员中：

```
print iris.target
```

对于 iris 数据而言，就是各个实例的分类结果：

```
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
```

# Links

- [scipy_2015_sklearn_tutorial](https://github.com/amueller/scipy_2015_sklearn_tutorial)

    