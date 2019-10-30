# 区别
如果用于Hiccup表达式，则用`React`的方式表达：
- `as-element`返回一个`<Children />`
- `reactify-component`返回`Children`
 
前者返回一个可以作为子组件的组件，后者返回一个单纯的组件。更形象的表达：
```js
// as-element
function App () {
  return (
    <Children />
  )
}

// reactify-component
function App () {
  return (
    Children
  )
}
```

即`reactify-component`直接作用于`函数组件`，将其转换为`React`生态中可直接使用的`React Component`。不要用于`Hiccup`表达式。<br/>
相对来说，`as-element`则从另外一个用法角度实现这个功能。
