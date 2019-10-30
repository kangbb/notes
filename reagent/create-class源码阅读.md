# 源码结构
```shell
reagent.core/crete-class
|--reagent.impl.component/create-class
   |--reagent.impl.component/cljsify  # 以下函数,第一个函数参数为body,前一个函数的参数为后一个函数的输入值;最总获取一个"display-name
   |  |--reagent.impl.component/camelify-map-keys # map的键由 - 连接 转换为Camel形式
   |  |--reagent.impl.component/add-obligatory  # 基础obligatory包含了一些函数,如componentWillMount等,值为nil;通过merge将body的值并入
   |  |--reagent.impl.component/wrap-funs  # dev模式,判断是否存在或存在多个render函数；否则
   |  |  |                                  # render-fun :reagentRender的value,或:componentFunction的value,或nil
   |  |  |                                  # legacy-render render是否为nil
   |  |  |                                  # render-fun 若为空,则取:render的value
   |  |  |                                  # name 无name值,则以render-fun为参数,传入fun-name,此时render-fun为一个函数对象,在clojurescript中同样可以为函数添加member(即属性或者方法, es5中的类的若此,有此称谓)
   |  |  |                                  # 返回一个新的body值，对每个键值进行了处理，增加了:displayName 等键值
   |  |  |--reagent.impl.util/fun-name      # 从 render-fun中获取display-name
   |  |  |  |--reagent.interop/$            # 获取object成员 ($ o :foo) => (.-foo o); ($ o foo arg1 arg2) => (.foo o arg1 arg2)
   |  |  |--cljs.core/gensym                # 无法获取name,则使用gensym生成
   |  |  |--cljs.core/reudce-kv             # 对于传入的fmap(body)的每个键值，应用下面的函数进行wrap, 生成新的fmap
   |  |  |  |--cljs.core/assoc　　　　　　　　#　assoc coll &kvs  将kvs并入coll
   |  |  |  |  |--reagent.impl.compponent/get-wrapper        # 接收key, f; 根据key　wrap　f; 优先返回wrap，如果f为nil，返回错误
   |  |  |  |  |  |--reagent.impl.compponent／custom-wrapper　#　对于传入的每个键（如:getInitialState等)进行处理
   |  |  |  |  |  |　　　　　　　　　　　　　　　　　　　　　　　　　# :getInitialState  返回一个函数，该函数接受this为参数，通过state-atom获取cljsState属性; 对传入的函数对象f, 调用其 call方法属性，　传入两个this值; 运算结果赋予cljsState
   |  |  |  |  |  |  |--reagent.impl.component/state-atom 　#　赋予　this cljsState属性，它是一个　atom 类型的'nil'值, 并返回它
   |  |  |  |  |  |  |  |--reagent.ratom/atom 　#　定义reagent　atom, 它与＠atom保持联系
   
```
# ClojureScript相关知识
### 1. 自托管
即一切实现都通过`ClojureScript`自身实现,不需要通过`Clojure`.

### 2. Javascript工作原理
参考链接:<br/>
[https://juejin.im/post/5a5d64fbf265da3e243b831f](https://juejin.im/post/5a5d64fbf265da3e243b831f)

### 3. defprotocol, definterface, deftype, defrecord
ClojureScript和Clojure在这四个函数上中的定义和使用没有显式差别:
- defprotocol和definterface定义一个函数set,其中前者this必须显式指定,如:
  ```clojure
  (defprotocol Fly
    (fly [this name]))
  
  (definterface Fly
    (fly [name]))
  ```
- deftype和defrecord定义函数的实现,如:
  ```clojure
  (deftype Bird [bird]
    Fly
    (fly [this name] (str bird " likes " name)))
  
  (defrecord Bird [bird]
    Fly
    (fly [this name] (str bird " likes " name)))
  ```
- 使用实现的函数. 如:
  ```clojure
   (fly (Bird. "dove") "bread")
  ```
### 3. and or
- and 有一个为`nil`,则返回`nil`,返回最后一格参数的值
- or  一个不为`nil`, 则返回第一个不为`nil`的值; 否则返回`nil`

### JavaScript and ClojureScript Function
它们相同，所以具有相同的对象属性．
例如，在cljs中，你也可以对函数进行如下调用：

```clojure
(.call f this x y)
```