# `animation`相关

## 什么是`animation`

`animation`是赋予`object`以一定的动作。常见的包括：

- `Modal`设置`animatonType`为一个`非 none`的值
- `Toast`的出现和消失同样可以伴随着动画
- `anmation`相关的组件和函数

在`react native`中，也给了我们一些管理动画的工具， 如`InteractionManager`，其中`method`包括：

- runAfterInteractions: 在一系列交互之后执行某些耗时的任务
- requestAnimationFrame: 随着时间变化，改变动画。
- setImmediate/setTimeout： 会影响动画，可能会`delay animation`

`交互`的定义： 一系列连续的`animation`或者`用户触摸、点击等操作`。这些必须是连续的，不能有太长的时间间隔，例如页面导航切换等，
往往会打断一个`交互`。

## 如何实现`animation`之间、`animation`和耗时任务之间的切换

`runAfterInteractions`不会影响动画，`setImmediate/setTimeout`会影响动画。所以，我们可以通过在`setImmediate/setTimeout`内
嵌套`runAfterInteractions`的方式实现一些复杂的`交互`。定义：

```clj
(defn after-animation
  [func]
  (.runAfterInteractions rn/InteractionManager func))

(defn delay-job
  [func time]
  (js/setTimeout #(after-animation func) time))
```

## 应用:`modal`的切换

多个`Modal`连续切换往往不会成功，有些`Modal`直接不会显示。其中的原因便是`animation`。在一个`animation`结束之前，开始另一个`animation`，
往往会导致后一个`animation`失效。

因此，有两种方式解决：

- 设置`animationType`为`none`
- 使用上一小节提到的：`runAfterAnimation`和`setTimeout`结合避免。
