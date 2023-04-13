
---
title: 材质
linktitle: 材质
type: book
commentable: true
---

# Three.js 材质

材质结合几何体可以构成网格。材质就像是物体的皮肤，决定几何体外表的样子。例如，皮肤可以决定一个几何体看起来是否像金属、透明与否，以及是否显示成线框。然后这个网格才可以添加到场景中，并由 Three.js 库来渲染。

- MeshBasicMaterial：网络基础材质，基础材质，可以用它赋予几何体一种简单的颜色，或者显示几何体的线框。

- MeshDepthMaterial：网络深度材质，根据网格到相机的距离，这种材质决定如何给网格染色。

- MeshNormalMaterial：网络法向材质，这是一种简单的材质，根据物体表面的法向向量计算颜色。

- MeshFaceMaterial：网络面材质，这是一个容器，可以在这个容器里为物体的各个表面指定不同的颜色。

- MeshLambertMaterial：网络朗伯材质，这种材质会考虑光照的影响，可以用来创建颜色暗淡的、不光亮的物体。

- MeshPhoneMaterial：网络 Phong 式材质，这种材质也会考虑光照的影响，而且可以用来创建光亮的物体。

- ShaderMaterial：着色器材质，这种材质允许使用自定义的着色器程序，直接控制顶点的放置方式，以及像素的着色方式。

- LineBasicMaterial：直线基础材质，这种材质可以用于 THREE.line(直线)几何体，从而创建着色的直线。

- LineDashedMaterial：虚线材质，这种材质跟直线基础材质一样，不过可以用来创建出一种虚线效果。

    