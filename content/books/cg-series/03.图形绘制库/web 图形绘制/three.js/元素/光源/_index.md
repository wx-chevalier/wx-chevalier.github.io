
---
title: 光源
linktitle: 光源
type: book
commentable: true
---

# Three.js 中的光源

Three.js 为我们提供了一系列光源，而且每种光源都有特定的行为和用户：

- AmbientLight: 环境光，这是一种基础光源，它的颜色会添加到整个场景和所有对象的当前颜色上。
- PointLight：点光源，空间中的一点，朝所有的方向发射光线。
- SpotLight：聚光灯光源，这种光源有聚光的效果，类似台灯，天花板的吊灯，或者手电筒。
- DirectionalLight：方向灯，也称作是无限光，从这种光源发出的光线可以看做是平行的，例如太阳光。
- HemisphereLight：半球光，这是一种特殊光源，可以用来创建更加自然的室外光线，模拟反光面和光线微弱的天空。
- AreaLight：面光源，使用这种光源可以指定散发光线的平面，而不是空间的一个点。
- LensFlare：镜头眩光，这不是一种光源,但是通过 LensFlare 可以为场景中的光源添加眩光效果。

    