
---
title: 快速开始
linktitle: 快速开始
type: book
commentable: true
---

# 快速开始

![Three.js 对象组件](https://s1.ax1x.com/2020/10/28/B1NFdf.md.png)

首先有一个 Renderer。这可以说是 three.js 的主要对象。你传入了一个 Scene 和一个 Camera 到 Renderer 里面，然后他来渲染（画）出在相机视椎体中的 3D 场景，作为一个 2D 的图片在画布上。然后有一个场景图（Screen Graph），它是一个类似树的结构，由很多对象组成，比如一个 Scene 对象，多个 Mesh 对象，Light 对象，Group，Object3D，和 Camera 对象。一个 Scene 对象定义了场景图最基本的要素，并包含背景色和雾等属性。这些对象定义了一个分层的父/子树的结构，并且展现出对象出现的地方和他们的方向。子对象的位置和方向是相对于父对象而言的。比如说汽车的轮子是汽车的子对象，这样移动和定位汽车就会自动移动轮子。注意图中 Camera 是一半在场景图中，一半在场景图外的。这表示在 three.js 中，不像其他的对象一样，一个 Camera 不一定要在场景图中起作用。就像其他的对象一样，一个 Camera，作为一些其他对象的子对象，将会跟随他的父对象移动和朝向。

Mesh 对象代表用一个特定的 Material 绘制一个特定的 Geometry。Material 对象和 Geometry 对象可以被多个 Mesh 对象使用。比如在不同的位置画两个蓝色立方体，我们会需要两个 Mesh 对象来代表每一个立方体的位置和方向。我们只需要一个 Geometry 来存放立方体的顶点数据，和一个 Material 来定义蓝色就可以了。两个 Mesh 对象都涉及到相同的 Geometry 对象和 Material 对象。Geometry 对象代表一些几何体，比如说球体、立方体、平面、狗、猫、人、树、建筑等的顶点信息。Three.js 提供了多种内置的基本元素 。你也可以创建自定义几何体并且从文件中加载几何体。

Material 对象代表绘制几何体的表面属性，包括使用的颜色，和光亮程度。一个 Material 可以引用一个或多个 Texture 对象，这些对象可以用来，例如，将图像包裹到几何体的表面。Texture 对象通常代表图片要么从图像文件中加载，在画布上形成，要么 由另一个场景渲染出。Light 对象代表不同种类的光。

    