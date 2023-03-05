
---
title: 模型构建
linktitle: 模型构建
type: book
commentable: true
---

# 模型构建

TensorFlow 中提供了三种方式来构建模型：

- 使用 Sequential 按层顺序构建模型
- 使用函数式 API 构建任意结构模型
- 继承 Model 基类构建自定义模型

对于顺序结构的模型，优先使用 Sequential 方法构建。如果模型有多输入或者多输出，或者模型需要共享权重，或者模型具有残差连接等非顺序结构，推荐使用函数式 API 进行创建。如果无特定必要，尽可能避免使用 Model 子类化的方式构建模型，这种方式提供了极大的灵活性，但也有更大的概率出错。

# 案例：IMDB

```py
import numpy as np
import pandas as pd
import tensorflow as tf
from tqdm import tqdm
from tensorflow.keras import *


train_token_path = "./data/imdb/train_token.csv"
test_token_path = "./data/imdb/test_token.csv"

MAX_WORDS = 10000  # We will only consider the top 10,000 words in the dataset
MAX_LEN = 200  # We will cut reviews after 200 words
BATCH_SIZE = 20

# 构建管道
def parse_line(line):
    t = tf.strings.split(line,"\t")
    label = tf.reshape(tf.cast(tf.strings.to_number(t[0]),tf.int32),(-1,))
    features = tf.cast(tf.strings.to_number(tf.strings.split(t[1]," ")),tf.int32)
    return (features,label)

ds_train=  tf.data.TextLineDataset(filenames = [train_token_path]) \
   .map(parse_line,num_parallel_calls = tf.data.experimental.AUTOTUNE) \
   .shuffle(buffer_size = 1000).batch(BATCH_SIZE) \
   .prefetch(tf.data.experimental.AUTOTUNE)

ds_test=  tf.data.TextLineDataset(filenames = [test_token_path]) \
   .map(parse_line,num_parallel_calls = tf.data.experimental.AUTOTUNE) \
   .shuffle(buffer_size = 1000).batch(BATCH_SIZE) \
   .prefetch(tf.data.experimental.AUTOTUNE)
```

## Sequential 按层顺序创建模型

```py
tf.keras.backend.clear_session()

model = models.Sequential()

model.add(layers.Embedding(MAX_WORDS,7,input_length=MAX_LEN))
model.add(layers.Conv1D(filters = 64,kernel_size = 5,activation = "relu"))
model.add(layers.MaxPool1D(2))
model.add(layers.Conv1D(filters = 32,kernel_size = 3,activation = "relu"))
model.add(layers.MaxPool1D(2))
model.add(layers.Flatten())
model.add(layers.Dense(1,activation = "sigmoid"))

model.compile(optimizer='Nadam',
            loss='binary_crossentropy',
            metrics=['accuracy',"AUC"])

model.summary()
```

![模型案例](https://github.com/lyhue1991/eat_tensorflow2_in_30_days/raw/master/data/Sequential%E6%A8%A1%E5%9E%8B%E7%BB%93%E6%9E%84.png)

```py
import datetime
import matplotlib.pyplot as plt

baselogger = callbacks.BaseLogger(stateful_metrics=["AUC"])
logdir = "./data/keras_model/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = tf.keras.callbacks.TensorBoard(logdir, histogram_freq=1)
history = model.fit(ds_train,validation_data = ds_test,
        epochs = 6,callbacks=[baselogger,tensorboard_callback])

%matplotlib inline
%config InlineBackend.figure_format = 'svg'

def plot_metric(history, metric):
    train_metrics = history.history[metric]
    val_metrics = history.history['val_'+metric]
    epochs = range(1, len(train_metrics) + 1)
    plt.plot(epochs, train_metrics, 'bo--')
    plt.plot(epochs, val_metrics, 'ro-')
    plt.title('Training and validation '+ metric)
    plt.xlabel("Epochs")
    plt.ylabel(metric)
    plt.legend(["train_"+metric, 'val_'+metric])
    plt.show()

plot_metric(history,"AUC")
```

![AUC](https://github.com/lyhue1991/eat_tensorflow2_in_30_days/raw/master/data/6-1-fit%E6%A8%A1%E5%9E%8B.jpg)

# 函数式 API 创建任意结构模型

```py
tf.keras.backend.clear_session()

inputs = layers.Input(shape=[MAX_LEN])
x  = layers.Embedding(MAX_WORDS,7)(inputs)

branch1 = layers.SeparableConv1D(64,3,activation="relu")(x)
branch1 = layers.MaxPool1D(3)(branch1)
branch1 = layers.SeparableConv1D(32,3,activation="relu")(branch1)
branch1 = layers.GlobalMaxPool1D()(branch1)

branch2 = layers.SeparableConv1D(64,5,activation="relu")(x)
branch2 = layers.MaxPool1D(5)(branch2)
branch2 = layers.SeparableConv1D(32,5,activation="relu")(branch2)
branch2 = layers.GlobalMaxPool1D()(branch2)

branch3 = layers.SeparableConv1D(64,7,activation="relu")(x)
branch3 = layers.MaxPool1D(7)(branch3)
branch3 = layers.SeparableConv1D(32,7,activation="relu")(branch3)
branch3 = layers.GlobalMaxPool1D()(branch3)

concat = layers.Concatenate()([branch1,branch2,branch3])
outputs = layers.Dense(1,activation = "sigmoid")(concat)

model = models.Model(inputs = inputs,outputs = outputs)

model.compile(optimizer='Nadam',
            loss='binary_crossentropy',
            metrics=['accuracy',"AUC"])

model.summary()
```

```sh
Model: "model"
__________________________________________________________________________________________________
Layer (type)                    Output Shape         Param #     Connected to
==================================================================================================
input_1 (InputLayer)            [(None, 200)]        0
__________________________________________________________________________________________________
embedding (Embedding)           (None, 200, 7)       70000       input_1[0][0]
__________________________________________________________________________________________________
separable_conv1d (SeparableConv (None, 198, 64)      533         embedding[0][0]
__________________________________________________________________________________________________
separable_conv1d_2 (SeparableCo (None, 196, 64)      547         embedding[0][0]
__________________________________________________________________________________________________
separable_conv1d_4 (SeparableCo (None, 194, 64)      561         embedding[0][0]
__________________________________________________________________________________________________
max_pooling1d (MaxPooling1D)    (None, 66, 64)       0           separable_conv1d[0][0]
__________________________________________________________________________________________________
max_pooling1d_1 (MaxPooling1D)  (None, 39, 64)       0           separable_conv1d_2[0][0]
__________________________________________________________________________________________________
max_pooling1d_2 (MaxPooling1D)  (None, 27, 64)       0           separable_conv1d_4[0][0]
__________________________________________________________________________________________________
separable_conv1d_1 (SeparableCo (None, 64, 32)       2272        max_pooling1d[0][0]
__________________________________________________________________________________________________
separable_conv1d_3 (SeparableCo (None, 35, 32)       2400        max_pooling1d_1[0][0]
__________________________________________________________________________________________________
separable_conv1d_5 (SeparableCo (None, 21, 32)       2528        max_pooling1d_2[0][0]
__________________________________________________________________________________________________
global_max_pooling1d (GlobalMax (None, 32)           0           separable_conv1d_1[0][0]
__________________________________________________________________________________________________
global_max_pooling1d_1 (GlobalM (None, 32)           0           separable_conv1d_3[0][0]
__________________________________________________________________________________________________
global_max_pooling1d_2 (GlobalM (None, 32)           0           separable_conv1d_5[0][0]
__________________________________________________________________________________________________
concatenate (Concatenate)       (None, 96)           0           global_max_pooling1d[0][0]
                                                                 global_max_pooling1d_1[0][0]
                                                                 global_max_pooling1d_2[0][0]
__________________________________________________________________________________________________
dense (Dense)                   (None, 1)            97          concatenate[0][0]
==================================================================================================
Total params: 78,938
Trainable params: 78,938
Non-trainable params: 0
__________________________________________________________________________________________________
```

![网络结构](https://github.com/lyhue1991/eat_tensorflow2_in_30_days/raw/master/data/FunctionalAPI%E6%A8%A1%E5%9E%8B%E7%BB%93%E6%9E%84.png)

```py
import datetime
logdir = "./data/keras_model/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = tf.keras.callbacks.TensorBoard(logdir, histogram_freq=1)
history = model.fit(ds_train,validation_data = ds_test,epochs = 6,callbacks=[tensorboard_callback])

plot_metric(history,"AUC")
```

![AUC](https://github.com/lyhue1991/eat_tensorflow2_in_30_days/raw/master/data/6-1-2-train.jpg)

# Model 子类化创建自定义模型

```py
# 先自定义一个残差模块，为自定义Layer

class ResBlock(layers.Layer):
    def __init__(self, kernel_size, **kwargs):
        super(ResBlock, self).__init__(**kwargs)
        self.kernel_size = kernel_size

    def build(self,input_shape):
        self.conv1 = layers.Conv1D(filters=64,kernel_size=self.kernel_size,
                                   activation = "relu",padding="same")
        self.conv2 = layers.Conv1D(filters=32,kernel_size=self.kernel_size,
                                   activation = "relu",padding="same")
        self.conv3 = layers.Conv1D(filters=input_shape[-1],
                                   kernel_size=self.kernel_size,activation = "relu",padding="same")
        self.maxpool = layers.MaxPool1D(2)
        super(ResBlock,self).build(input_shape) # 相当于设置self.built = True

    def call(self, inputs):
        x = self.conv1(inputs)
        x = self.conv2(x)
        x = self.conv3(x)
        x = layers.Add()([inputs,x])
        x = self.maxpool(x)
        return x

    #如果要让自定义的Layer通过Functional API 组合成模型时可以序列化，需要自定义get_config方法。
    def get_config(self):
        config = super(ResBlock, self).get_config()
        config.update({'kernel_size': self.kernel_size})
        return config
# 测试ResBlock
resblock = ResBlock(kernel_size = 3)
resblock.build(input_shape = (None,200,7))
resblock.compute_output_shape(input_shape=(None,200,7))
TensorShape([None, 100, 7])
# 自定义模型，实际上也可以使用Sequential或者FunctionalAPI

class ImdbModel(models.Model):
    def __init__(self):
        super(ImdbModel, self).__init__()

    def build(self,input_shape):
        self.embedding = layers.Embedding(MAX_WORDS,7)
        self.block1 = ResBlock(7)
        self.block2 = ResBlock(5)
        self.dense = layers.Dense(1,activation = "sigmoid")
        super(ImdbModel,self).build(input_shape)

    def call(self, x):
        x = self.embedding(x)
        x = self.block1(x)
        x = self.block2(x)
        x = layers.Flatten()(x)
        x = self.dense(x)
        return(x)
tf.keras.backend.clear_session()

model = ImdbModel()
model.build(input_shape =(None,200))
model.summary()

model.compile(optimizer='Nadam',
            loss='binary_crossentropy',
            metrics=['accuracy',"AUC"])
```

    