
---
title: GPU 设置
linktitle: GPU 设置
type: book
commentable: true
---

# 使用单 GPU 训练模型

训练过程的耗时主要来自于两个部分，一部分来自数据准备，另一部分来自参数迭代。当数据准备过程还是模型训练时间的主要瓶颈时，我们可以使用更多进程来准备数据。

当参数迭代过程成为训练时间的主要瓶颈时，我们通常的方法是应用 GPU 或者 Google 的 TPU 来进行加速。无论是内置 fit 方法，还是自定义训练循环，从 CPU 切换成单 GPU 训练模型都是非常方便的，无需更改任何代码。当存在可用的 GPU 时，如果不特意指定 device，tensorflow 会自动优先选择使用 GPU 来创建张量和执行张量计算。我们也可以在开头控制每个任务使用的 GPU 编号和显存大小。

# GPU 设置

```py
gpus = tf.config.list_physical_devices("GPU")

if gpus:
    gpu0 = gpus[0] #如果有多个GPU，仅使用第0个GPU
    tf.config.experimental.set_memory_growth(gpu0, True) #设置GPU显存用量按需使用
    # 或者也可以设置GPU显存为固定使用量(例如：4G)
    #tf.config.experimental.set_virtual_device_configuration(gpu0,
    #    [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=4096)])
    tf.config.set_visible_devices([gpu0],"GPU")
```

比较 GPU 和 CPU 的计算速度：

```py
printbar()
with tf.device("/gpu:0"):
    tf.random.set_seed(0)
    a = tf.random.uniform((10000,100),minval = 0,maxval = 3.0)
    b = tf.random.uniform((100,100000),minval = 0,maxval = 3.0)
    c = a@b
    tf.print(tf.reduce_sum(tf.reduce_sum(c,axis = 0),axis=0))
printbar()

================================================================================17:37:01
2.24953778e+11
================================================================================17:37:01

printbar()
with tf.device("/cpu:0"):
    tf.random.set_seed(0)
    a = tf.random.uniform((10000,100),minval = 0,maxval = 3.0)
    b = tf.random.uniform((100,100000),minval = 0,maxval = 3.0)
    c = a@b
    tf.print(tf.reduce_sum(tf.reduce_sum(c,axis = 0),axis=0))
printbar()

================================================================================17:37:34
2.24953795e+11
================================================================================17:37:40
```

# 多 GPU 设置

```py
#此处在colab上使用1个GPU模拟出两个逻辑GPU进行多GPU训练
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    # 设置两个逻辑GPU模拟多GPU训练
    try:
        tf.config.experimental.set_virtual_device_configuration(gpus[0],
            [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=1024),
             tf.config.experimental.VirtualDeviceConfiguration(memory_limit=1024)])
        logical_gpus = tf.config.experimental.list_logical_devices('GPU')
        print(len(gpus), "Physical GPU,", len(logical_gpus), "Logical GPUs")
    except RuntimeError as e:
        print(e)
```

## 案例：MirroredStrategy

- 训练开始前，该策略在所有 N 个计算设备上均各复制一份完整的模型；
- 每次训练传入一个批次的数据时，将数据分成 N 份，分别传入 N 个计算设备（即数据并行）；
- N 个计算设备使用本地变量（镜像变量）分别计算自己所获得的部分数据的梯度；
- 使用分布式计算的 All-reduce 操作，在计算设备间高效交换梯度数据并进行求和，使得最终每个设备都有了所有设备的梯度之和；
- 使用梯度求和的结果更新本地变量（镜像变量）；
- 当所有设备均更新本地变量后，进行下一轮训练（即该并行策略是同步的）。

```py
MAX_LEN = 300
BATCH_SIZE = 32
(x_train,y_train),(x_test,y_test) = datasets.reuters.load_data()
x_train = preprocessing.sequence.pad_sequences(x_train,maxlen=MAX_LEN)
x_test = preprocessing.sequence.pad_sequences(x_test,maxlen=MAX_LEN)

MAX_WORDS = x_train.max()+1
CAT_NUM = y_train.max()+1

ds_train = tf.data.Dataset.from_tensor_slices((x_train,y_train)) \
          .shuffle(buffer_size = 1000).batch(BATCH_SIZE) \
          .prefetch(tf.data.experimental.AUTOTUNE).cache()

ds_test = tf.data.Dataset.from_tensor_slices((x_test,y_test)) \
          .shuffle(buffer_size = 1000).batch(BATCH_SIZE) \
          .prefetch(tf.data.experimental.AUTOTUNE).cache()

tf.keras.backend.clear_session()
def create_model():

    model = models.Sequential()

    model.add(layers.Embedding(MAX_WORDS,7,input_length=MAX_LEN))
    model.add(layers.Conv1D(filters = 64,kernel_size = 5,activation = "relu"))
    model.add(layers.MaxPool1D(2))
    model.add(layers.Conv1D(filters = 32,kernel_size = 3,activation = "relu"))
    model.add(layers.MaxPool1D(2))
    model.add(layers.Flatten())
    model.add(layers.Dense(CAT_NUM,activation = "softmax"))
    return(model)

def compile_model(model):
    model.compile(optimizer=optimizers.Nadam(),
                loss=losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=[metrics.SparseCategoricalAccuracy(),metrics.SparseTopKCategoricalAccuracy(5)])
    return(model)

#增加以下两行代码
strategy = tf.distribute.MirroredStrategy()
with strategy.scope():
    model = create_model()
    model.summary()
    model = compile_model(model)

history = model.fit(ds_train,validation_data = ds_test,epochs = 10)
```

    