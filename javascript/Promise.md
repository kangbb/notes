# Promise

## 创建实例

例如：

```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(10000).then((value) => {
  console.log(value);
});
```

只有返回一个`Promise`实例的函数，才能直接使用`.then`进行函数回调。同理，在`react native`的`AsyncStorage`中，`getItem`定义如下：
>static getItem(key: string, [callback]: ?(error: ?Error, result: ?string) => void): Promise

它返回一个`Promise`，所以可以使用：

```js
AsyncStorage.getItem(key)
  .then((value)=>{
    console.log(value)
    })
```

`setTimeOut`会影响事件循环，和`Promise`的异步有所区别。
