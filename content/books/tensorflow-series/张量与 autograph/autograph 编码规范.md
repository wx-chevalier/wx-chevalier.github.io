
---
title: AutoGraph 编码规范
linktitle: AutoGraph 编码规范
type: book
commentable: true
---

# AutoGraph 编码规范

- 被 @tf.function 修饰的函数应尽可能使用 TensorFlow 中的函数而不是 Python 中的其他函数。例如使用 tf.print 而不是 print，使用 tf.range 而不是 range，使用 tf.constant(True)而不是 True.
- 避免在 @tf.function 修饰的函数内部定义 tf.Variable.
- 被 @tf.function 修饰的函数不可修改该函数外部的 Python 列表或字典等数据结构变量。

# 函数使用

```py
import numpy as np
import tensorflow as tf

@tf.function
def np_random():
    a = np.random.randn(3,3)
    tf.print(a)

@tf.function
def tf_random():
    a = tf.random.normal((3,3))
    tf.print(a)

# np_random每次执行都是一样的结果。
np_random()
np_random()
array([[ 0.22619201, -0.4550123, -0.42587565],
       [ 0.05429906,  0.2312667, -1.44819738],
       [ 0.36571796,  1.45578986, -1.05348983]])
array([[ 0.22619201, -0.4550123, -0.42587565],
       [ 0.05429906,  0.2312667, -1.44819738],
       [ 0.36571796,  1.45578986, -1.05348983]])

# tf_random每次执行都会有重新生成随机数。
tf_random()
tf_random()
[[-1.38956189 -0.394843668 0.420657277]
 [2.87235498 -1.33740318 -0.533843279]
 [0.918233037 0.118598573 -0.399486482]]
[[-0.858178258 1.67509317 0.511889517]
 [-0.545829177 -2.20118237 -0.968222201]
 [0.733958483 -0.61904633 0.77440238]]
```

# 变量定义

```py
# 避免在@tf.function修饰的函数内部定义tf.Variable.

x = tf.Variable(1.0,dtype=tf.float32)
@tf.function
def outer_var():
    x.assign_add(1.0)
    tf.print(x)
    return(x)

outer_var()
outer_var()
@tf.function
def inner_var():
    x = tf.Variable(1.0,dtype = tf.float32)
    x.assign_add(1.0)
    tf.print(x)
    return(x)

#执行将报错
#inner_var()
#inner_var()
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
<ipython-input-12-c95a7c3c1ddd> in <module>
      7
      8 #执行将报错
----> 9 inner_var()
     10 inner_var()

~/anaconda3/lib/python3.7/site-packages/tensorflow_core/python/eager/def_function.py in __call__(self, *args, **kwds)
    566         xla_context.Exit()
    567     else:
--> 568       result = self._call(*args, **kwds)
    569
    570     if tracing_count == self._get_tracing_count():
......
ValueError: tf.function-decorated function tried to create variables on non-first call.
```

# 不可变性

```py
tensor_list = []

#@tf.function #加上这一行切换成Autograph结果将不符合预期！！！
def append_tensor(x):
    tensor_list.append(x)
    return tensor_list

append_tensor(tf.constant(5.0))
append_tensor(tf.constant(6.0))
print(tensor_list)
[<tf.Tensor: shape=(), dtype=float32, numpy=5.0>, <tf.Tensor: shape=(), dtype=float32, numpy=6.0>]
tensor_list = []

@tf.function #加上这一行切换成Autograph结果将不符合预期！！！
def append_tensor(x):
    tensor_list.append(x)
    return tensor_list


append_tensor(tf.constant(5.0))
append_tensor(tf.constant(6.0))
print(tensor_list)
[<tf.Tensor 'x:0' shape=() dtype=float32>]
```

    