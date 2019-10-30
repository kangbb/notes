# Refs

## 创建

参考：[https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#creating-refs](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#creating-refs)

## 使用

ref 会在 `componentDidMount` 或 `componentDidUpdate` 生命周期钩子触发前更新。

- [https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element)

有时一个组件内部存在分支，所以在`componentDidUpdate`内部才能获取更新。

- [https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback](https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback)

## 不要使用`setState`存储`ref`

不要使用`setState`存储`ref`.
