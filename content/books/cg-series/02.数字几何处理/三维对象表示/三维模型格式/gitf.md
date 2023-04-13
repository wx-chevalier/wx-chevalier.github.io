
---
title: gITF
linktitle: gITF
type: book
commentable: true
---

# gITF

glTF 称为 3D 界的 JPEG，使用了更优的数据结构，为应用程序实时渲染而生。glTF 有以下几大特点：

- 由现有 OpenGL 的维护组织 Khronos 推出，目的就是为了统一用于应用程序渲染的 3D 格式，更适用于基于 OpenGL 的引擎；
- 减少了 3D 格式中除了与渲染无关的冗余信息，最小化 3D 文件资源；
- 优化了应用程序读取效率和和减少渲染模型的运行时间；
- 支持 3D 模型几何体、材质、动画及场景、摄影机等信息。

glTF 导出格式有两种后缀格式可供选择：.gltf 和 .glb：

- .gltf 文件导出时一般会输出两种文件类型，一是 .bin 文件，以二进制流的方式存储顶点坐标、顶点法线坐标和贴图纹理坐标、贴图信息等模型基本数据信息；二是 .gltf 文件，本质是 json 文件，记录对 bin 文件中模型顶点基本数据的索引、材质索引等信息，方便编辑，可读性较好；
- .glb 文件格式只导出一个 .glb 文件，将所有数据都输出为二进制流，通常来说会更小一点，若不关心模型内的具体数据可直接选择此类型。

# Links

- [2019-腾讯硬核干货！如何在页面极速渲染 3D 模型？](https://www.uisdc.com/optimizing-3d-model)

- [2020-STEP 和 IGES 模型转换为适用 Web 的 glb 格式](https://blog.wj2015.com/2020/03/08/step%e5%92%8ciges%e6%a8%a1%e5%9e%8b%e8%bd%ac%e6%8d%a2%e4%b8%ba%e9%80%82%e7%94%a8web%e7%9a%84glb%e6%a0%bc%e5%bc%8f/)

    