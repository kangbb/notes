# clojurescript中的#js和clj->js

## javascript数据类型

javascript包括两种数据类型，原始/基本数据类型和引用数据类型。<br />

### "基本数据类型"

javaScript 中共有6种基本数据类型：
- `Undefined`
- `Null`
- `Boolean`
- `Number`
- `String`
- `Symbol` (new in ES 6)

基本数据类型按值引用，其保存在`栈内存`，占内存中包括了`变量的标示`和`变量的值`。

### "引用类型"

除过上面的6种基本数据类型外，剩下的就是引用类型了，统称为`Object`类型。细致的分类，包括：

- `Object`
- `Array`
- `Date`
- `RegExp`
- `Function`
- `Map`

引用类型按引用访问，其值是保存在堆内存中的对象。其中：栈内存中保存了变量标识符和指向堆内存中该对象的指针，堆内存中保存了对象的内容。<br/>

`Object`和`Map`类型的区别：<br/>
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)<br/>
本小节参考：<br/>
[https://segmentfault.com/a/1190000006752076](https://segmentfault.com/a/1190000006752076)

## clojure不可变性和持久数据结构
Clojure的任何值都是不可变的，引用可以任意赋值。即只有可变引用，没有可变对象。
```clojure
(def a '(1 2 3 4))
(def a (conj 1 a));=(5 1 2 3 4)

;继续上面的list
;好比a和b共享'(1 2 3 4)部分
(def a '(1 2 3 4))
(def b (conj a 5));=(5 1 2 3 4)
;做一下校验xianshizhuanhuan
(identical? a (next b));=true
;在这个简单例子的视图可见，5确实添加在链表，但指向5的指针是b，指针a没有任何偏移。
; b    a
; |    |
;[5]--[1]--[2]--[3]--[4]
```
参考：[初学Clojure—不可变性与惰性](http://huangzehong.me/2017/01/29/20170129-%E5%88%9D%E5%AD%A6Clojure%E2%80%94%E4%B8%8D%E5%8F%AF%E5%8F%98%E6%80%A7%E4%B8%8E%E6%83%B0%E6%80%A7/)<br />
<br />
不可变意味着值无法更改,持久性意味着如果值已存在于程序中,则复制值的路径。 Clojure将此作为其结构共享实现的一部分.如果数据不存在,则创建它。如果数据存在,则新数据将基于旧版本的数据构建,而不会更改或删除它。它也提供了`atom`和`transient`两种可变类型。<br/>
想要做性能优化等，需要更加深入了解不可变数据结构的实现。

## `clj->js`和`#js`

这两个是clojurescript和javascript的互操作。它们的区别在于：
- `clj->js`递归的将clojurescript类型转换为对应的javascript类型。例如：
- ```clojure
  (clj->js [1 {:foo "bar"} 4])
  ;;=> #js [1 #js {:foo "bar"} 4]
  ```
  类型转换表参考：<br/>
  [https://cljs.github.io/api/cljs.core/clj-GTjs](https://cljs.github.io/api/cljs.core/clj-GTjs)

- `#js`一种tag, 只支持转换 clojurescript类型的`Vector`和`Map`类型，不支持嵌套转换。参考：<br/>
  [https://cljs.github.io/api/syntax/js-literal](https://cljs.github.io/api/syntax/js-literal)

`clj->js` 支持的`keyword-fn`参数：
[https://cljs.github.io/api/cljs.core/clj-GTjs](https://cljs.github.io/api/cljs.core/clj-GTjs)

当然，只有转换格式为`map`，且`key`的类型为`keyword`时才生效。

**为什么需要互操作？**<br />

clojurescript类型不会隐式/自动转换为javascript类型。所以，当引用某些javascript原生类型函数时，需要传入javascript类型参数，便需要显式转换。
