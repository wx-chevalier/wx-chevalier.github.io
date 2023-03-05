
---
title: TensorFlow Serving
linktitle: TensorFlow Serving
type: book
commentable: true
---

# tensorflow-serving

TensorFlow 训练好的模型以 TensorFlow 原生方式保存成 protobuf 文件后可以用许多方式部署运行：

- 通过 tensorflow-js 可以用 javascrip 脚本加载模型并在浏览器中运行模型。
- 通过 tensorflow-lite 可以在移动和嵌入式设备上加载并运行 TensorFlow 模型。
- 通过 tensorflow-serving 可以加载模型后提供网络接口 API 服务，通过任意编程语言发送网络请求都可以获取模型预测结果。
- 通过 TensorFlow for Java 接口，可以在 Java 或者 spark(scala)中调用 TensorFlow 模型进行预测。

使用 tensorflow serving 部署模型要完成以下步骤：

- 准备 protobuf 模型文件。
- 安装 tensorflow serving。
- 启动 tensorflow serving 服务。
- 向 API 服务发送请求，获取预测结果。

详细的演示请参阅 [tf_serving.ipynb](./tf_serving.ipynb)

    