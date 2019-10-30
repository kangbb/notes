# ` and ~
在clojurescript中,使用 \` 和 `~`定义 `macro`.
其中, \` 表示宏的起始位置, `~`对变量进行取值,将变量变换为符;或者对函数进行求值. 例如:
```clojure
(def s `(str "12" "34"))
s
;=> (cljs.core/str "12" "34")

(def s `~(str "12" "34"))
s
;=> "1234"

(def name "Jack")
(def greet `~(str "Hello " name))
greet
;=> "Hello Jack"

(def greet `~(str "Hello " ~name))
;=> Cannot read property 'call' of undefined
;	 (evalmachine.<anonymous>:2:91)
;	 (evalmachine.<anonymous>:3:1004)
;	 Script.runInThisContext (vm.cljs:124:20)
;	 Object.runInThisContext (vm.cljs:314:38)
;	 (Object.It)
;	 (Object.lumo.repl.caching_node_eval)
;	 (NO_SOURCE_FILE <embedded>:6029:9)
;	 z (NO_SOURCE_FILE <embedded>:6030:22)
;	 (NO_SOURCE_FILE <embedded>:6025:264)
;	 Function.cljs.core.trampoline.cljs$core$IFn$_invoke$arity$1  (NO_SOURCE_FILE <embedded>:1927:142)
```
所以,作为参数时,不能对变量进行取值操作,否则会报错. 此时对变量取值,会将`变量的值`作为一个有意义的符号,如`函数 变量`等,所以会报错.

# js对象

## `js-keys`
获取对象的键，为`#js Array`类型
## `aget`
获取`js Array`的值。如：
```clojure
（aget #js [1 2 3] 0)
;=> 1
```
获取对象的属性值。如：
```
(aget #js {:foo "bar"} "foo")
;=> "bar"
```
推荐使用`goog.object/get`和`goog.object/getValueByKeys`

## `aset`
设置`js Array`的值。当然，也可以作用于更广泛的`js Object`.

## `set!`

设置对象属性。
```clojure
(set! (.-name person) "Jhone")
```

## 获取对象属性值的方法总结
变量属性
```clojure
(def person #js {:name "Jack"})
(.-name person)
(aget person "name")
(goog.object/get person "name")
```

函数属性
```clojure
(def person #js {:name "Jack"})

(aset person "add" (fn [a b] (+ a b))
; (goog.object/set person "add" (fn [a b] (+ a b))
(.-add person) ; 获取函数
(.add person 1 3); 函数求值，4
```

## 优秀的互操作库

参考：
[https://github.com/binaryage/cljs-oops](https://github.com/binaryage/cljs-oops)

# map, vector, set 本身即函数 - 函数对象

对于`map`, 传入键， 获取键值。

```clj
(def person {:name "Jack" :age 23})
(person :name)
;; => "Jack"

;; 由于这种性质，它本身也可以转换为布尔函数。
;; (person :name), :name对应的值不为nil, 所以相当于返回了true
;; 从而可以定义 spec
(s/def ::person {:name "jack" :age 23})
(s/conform ::person :name)
;; => :name
;; 传入::name 返回 "jack"， 不为nil, 所以为true

(s/def ::person {:name nil :age 23})
(s/conform ::person :name)
;;=> :clojure.spec.alpha/invalid
;; 返回值为 nil, 所以为false
```

对于`vector`, 传入下标， 返回下标对应的值。

```clj
(def num [1 2 3])
(num 0)
;;=> 1
```

对于`set`,传入set中包含的值，返回该值；传入set中不包含的值，返回`nil`

```clj
(def num #{1 2 3 4})
(num 1)
;;=> 1
```

这两类同样可以用来定义`spec`，作为简单的布尔函数。

# `keyword`也是一个函数

`keyword`本身也是函数，传入一个`map`返回其所对应的值。

```clj
(def a :num)
(a {:num 23})
;;=> 23
```
