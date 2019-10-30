# 重点

- 划分组件。 UI组件和数据模型对应，细化组件。
- 编写静态版本。内容简单，自上而下；内容复杂，自下而上。不设计`prop`和`state`。
- 确定`UI state`的最小表示。通过以下三个方面：
  >1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
  >2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
  >3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。

- 确定`state`的放置位置，并传递`props`
- 添加反向数据流。通过使用父组件/祖先组件传递的函数实现。

# 思考

在`react`中，将`state`和其`handleFunction`作为`props`传递给子组件，从而实现状态提升和状态共享。那么`cljs`中该如何做？如何通过函数组合实现？
- 使用匿名函数实现。在父组件中定义函数，并传递给子组件，可以直接使用父组件中的`state`变量。