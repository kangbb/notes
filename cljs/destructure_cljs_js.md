# 解构

## 解构赋值

`cljs`参考：[https://cljs.github.io/api/syntax/#destructure-vector](https://cljs.github.io/api/syntax/#destructure-vector)<br/>
`javascript`参考：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

## 关于函数参数解构问题

如果`cljs`定义的某个函数需要传递给接受函数作为参数的`js`函数，或者赋值给`js`某个对象、属性等，如果函数使用了解构赋值，将会出错。**编译器编译时，并不会将`cljs`的解构赋值方式转换为`js`解构赋值方式。**

`js`解构函数赋值传参，本质上是将一个对象作为参数传入，并在传入时直接进行了解构赋值处理。所以，`cljs`编程时，作为替代，应将所有解构赋值参数作为一个`object`对待，在函数内部进行处理，以适应`js`方式。例如：

```js
function get-info ({name, age}) {
  console.log(name)
}
```
```clj
(defn get-info
  [^js obj]
  (.log js/Console (aget obj "name")))
```

`cljs`解构传参带默认值方式`:or {}`,例如：
```clj
(defn add
  [{:keys [a b c] :or {a 0 b 1 c 1}}]
  (println (+ a b c)))
```

```clj
#js{:argv [#object[navigation_app$pages$user$core$user] #js {:pop #object[Function], :popToTop #object[Function], :push #object[Function], :replace #object[Function], :reset #object[Function], :dismiss #object[Function], :goBack #object[Function], :navigate #object[Function], :setParams #object[Function], :state #js {:routeName user, :key id-1567148481853-2}, :router nil, :actions #js {:pop #object[pop], :popToTop #object[popToTop], :push #object[push], :replace #object[replace], :reset #object[reset], :dismiss #object[dismiss], :goBack #object[goBack], :navigate #object[navigate], :setParams #object[setParams]}, :getParam #object[Function], :getChildNavigation #object[getChildNavigation], :isFocused #object[isFocused], :isFirstRouteInParent #object[isFirstRouteInParent], :dispatch #object[Function], :getScreenProps #object[Function], :dangerouslyGetParent #object[Function], :addListener #object[addListener], :emit #object[emit]} {:routeName user, :key id-1567148481853-2}]}
```