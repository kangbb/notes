# JavaScript引用类型
- javascript除了基本类型，其他都是引用类型(Object类型)。
- 两个类型指向同一个引用类型，则它们严格相等。引用对象改变，但是所有引用对象还是指向同一个引用。如：
  ```js
  var a = {name: "Jack", age: 23}
  var b = a
  // 比较
  a === b // true
  // 改变
  a.sex = "man"
  a === b //true
  ```
## 补充一： `array`
### `push`和`concat`
- push 遇到数组参数时，把整个数组参数作为一个元素；而 concat 则是拆开数组参数，一个元素一个元素地加进去
- push 直接改变当前数组；concat 不改变当前数组。
