
---
title: 模型训练
linktitle: 模型训练
type: book
commentable: true
---

# 模型训练

模型的训练主要有内置 fit 方法、内置 tran_on_batch 方法、自定义训练循环。

# 三种模型训练方法

```py
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import *

#打印时间分割线
@tf.function
def printbar():
    today_ts = tf.timestamp()%(24*60*60)

    hour = tf.cast(today_ts//3600+8,tf.int32)%tf.constant(24)
    minite = tf.cast((today_ts%3600)//60,tf.int32)
    second = tf.cast(tf.floor(today_ts%60),tf.int32)

    def timeformat(m):
        if tf.strings.length(tf.strings.format("{}",m))==1:
            return(tf.strings.format("0{}",m))
        else:
            return(tf.strings.format("{}",m))

    timestring = tf.strings.join([timeformat(hour),timeformat(minite),
                timeformat(second)],separator = ":")
    tf.print("=========="*8+timestring)

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
```

## 内置 fit 方法

该方法功能非常强大, 支持对 numpy array, tf.data.Dataset 以及 Python generator 数据进行训练。并且可以通过设置回调函数实现对训练过程的复杂控制逻辑。

```py
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
                loss=losses.SparseCategoricalCrossentropy(),
                metrics=[metrics.SparseCategoricalAccuracy(),metrics.SparseTopKCategoricalAccuracy(5)])
    return(model)

model = create_model()
model.summary()
model = compile_model(model)

history = model.fit(ds_train,validation_data = ds_test,epochs = 10)
```

## 内置 train_on_batch 方法

该内置方法相比较 fit 方法更加灵活，可以不通过回调函数而直接在批次层次上更加精细地控制训练的过程。

```py
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
                loss=losses.SparseCategoricalCrossentropy(),
                metrics=[metrics.SparseCategoricalAccuracy(),metrics.SparseTopKCategoricalAccuracy(5)])
    return(model)

model = create_model()
model.summary()
model = compile_model(model)

def train_model(model,ds_train,ds_valid,epoches):

    for epoch in tf.range(1,epoches+1):
        model.reset_metrics()

        # 在后期降低学习率
        if epoch == 5:
            model.optimizer.lr.assign(model.optimizer.lr/2.0)
            tf.print("Lowering optimizer Learning Rate...\n\n")

        for x, y in ds_train:
            train_result = model.train_on_batch(x, y)

        for x, y in ds_valid:
            valid_result = model.test_on_batch(x, y,reset_metrics=False)

        if epoch%1 ==0:
            printbar()
            tf.print("epoch = ",epoch)
            print("train:",dict(zip(model.metrics_names,train_result)))
            print("valid:",dict(zip(model.metrics_names,valid_result)))
            print("")

train_model(model,ds_train,ds_test,10)
```

## 自定义训练循环

自定义训练循环无需编译模型，直接利用优化器根据损失函数反向传播迭代参数，拥有最高的灵活性。

```py
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

model = create_model()
model.summary()
optimizer = optimizers.Nadam()
loss_func = losses.SparseCategoricalCrossentropy()

train_loss = metrics.Mean(name='train_loss')
train_metric = metrics.SparseCategoricalAccuracy(name='train_accuracy')

valid_loss = metrics.Mean(name='valid_loss')
valid_metric = metrics.SparseCategoricalAccuracy(name='valid_accuracy')

@tf.function
def train_step(model, features, labels):
    with tf.GradientTape() as tape:
        predictions = model(features,training = True)
        loss = loss_func(labels, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))

    train_loss.update_state(loss)
    train_metric.update_state(labels, predictions)


@tf.function
def valid_step(model, features, labels):
    predictions = model(features)
    batch_loss = loss_func(labels, predictions)
    valid_loss.update_state(batch_loss)
    valid_metric.update_state(labels, predictions)


def train_model(model,ds_train,ds_valid,epochs):
    for epoch in tf.range(1,epochs+1):

        for features, labels in ds_train:
            train_step(model,features,labels)

        for features, labels in ds_valid:
            valid_step(model,features,labels)

        logs = 'Epoch={},Loss:{},Accuracy:{},Valid Loss:{},Valid Accuracy:{}'

        if epoch%1 ==0:
            printbar()
            tf.print(tf.strings.format(logs,
            (epoch,train_loss.result(),train_metric.result(),valid_loss.result(),valid_metric.result())))
            tf.print("")

        train_loss.reset_states()
        valid_loss.reset_states()
        train_metric.reset_states()
        valid_metric.reset_states()

train_model(model,ds_train,ds_test,10)
```

    