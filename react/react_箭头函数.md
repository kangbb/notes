# 在render中使用箭头函数

在`render`中使用箭头函数绑定值，会导致多余的渲染。因为每次都会进行渲染时，都会产生一个新的函数。例如：
```js
render () {
  <ul>
    {
      this.state.users.map( user => {
        return <User
          key={user.id}
          name={user.name}
          onDeleteClick={() => this.deleteUser(user.id)} />
        })
    }
  </ul>
}
```

虽然只是删除了一个用户，但是所有的用户都会重新`render`,尽管它们的并没有更新。因为每次都会父组件`render`时，又重新生成了一个函数对象，传递给每一个子组件。所以请避免。

## 参考

参考：[https://juejin.im/post/5d3064e5f265da1bc75271cb](https://juejin.im/post/5d3064e5f265da1bc75271cb)
