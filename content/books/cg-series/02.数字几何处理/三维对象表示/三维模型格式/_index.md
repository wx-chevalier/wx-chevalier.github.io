
---
title: 三维模型格式
linktitle: 三维模型格式
type: book
commentable: true
---

# Three.js 中的模型导出与加载

- JSON：Three.js 有它自己的 JSON 文件格式,你可以用它以声明的方式定义几何体和场景。但它并不是一种正式的格式。它很容易使用,当你要复用复杂的几何体或场景时非常有用

- OBJ 是一种简单的三维文件格式,由 Wavefront 科技公司创立。它是使用最广泛的三维文 OBJ 和 MTL 件格式,用来定义对象的几何体。ML 文件常同 OBJ 文件一起使用,在一个 MTL 文件中,对象的材质定义在 OBJ 文件中

- Collad：Collada 是一种用来定义 XML 类文件中数字内容的格式。这也是一种被广泛使用的格式,差不多所有的三维软件和渲染引擎都支持这种格式。

- STL：STL 是 STereoLithography(立体成型术)的缩写,广泛用于快速成型。例如三维打印机的模型文件通常都是 STL 文件。

- CTM：CTM 是由 openCTM 创建的文件格式。可以用来压缩存储表示三维网格的三角形面片。

- VTK：VTK 是由 Visualization Toolkit 定义的文件格式,用来指定顶点和面。VTK 有两种格式,Three. js 支持旧的,即 ASC 格式。

- PDB：这是一种非常特别的格式,由 Protein Databank(蛋白质数据银行)创建,用来定义蛋白质的形状。Three. js 可以加载并显示用这种格式描述的蛋白质。

- PLY：该格式全称是多边形(polygon)文件格式，通常用来保存三维扫描仪的数据。

    