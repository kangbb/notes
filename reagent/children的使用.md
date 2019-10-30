# children的使用

在`reagent`中使用`children`存在常见的两种情况：

- 传递`children`给`reagent`组件
- 传递`children`给`React`组件

在`reagent`中使用`children list`，一般使用`map`或这`for`展开，但是需要为每个组件使用`as-element`。

在`React`中使用`children list`， 一般使用`this.props.children`，这时，它是一个数组。`reagent`组件传递
给其时，可以直接传递组件数组，也可以直接传递组件`fragment`。如：

```clj
;;; fragment
[:> React-compoent
  [child1]
  [child2]
  [child3]]

;;; array
[:> React-compoent
  #js [ [child1] [child2]]]
```

## 如何使用`key`

如何理解`reagent`的`key`? 参考：

[https://github.com/reagent-project/reagent/issues/34](https://github.com/reagent-project/reagent/issues/34)

如何传递？

```clj
;;; first way
[component {:key value}]

;;; second way
^{:key value} [component]
```
