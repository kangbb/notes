# 补充

## 两个版本

clj spc-alpha: [https://github.com/clojure/spec.alpha](https://github.com/clojure/spec.alpha)<br/>
clj spec-alpha: [https://github.com/clojure/spec-alpha2](https://github.com/clojure/spec-alpha2)

新版本不完全兼容旧版本，相比于旧版本新增了部分特性。

## 引入命名空间

当引其他`命名空间`(文件)时，其中的可执行语句会立即执行。如有多个文件，则会按照引入顺序执行。如：

```clj
;; my.greet
(println "Hello")
;; my.name
(println "world")
;; my.core
(ns my.core
  (:require [my.greet :as g]
            [my.name :as n]))
;; 执行， 输出：
;; =>
;; Hello
;; world
```

## `s/validate-func`的区别
> s, `clojure.spec.alpha`
函数的返回结果并不不会自动打印(`println`或`print`)；如果查看结果，需要手动打印。当然，`repl`例外。

`s/validate-func`函数的除了返回结果有所不同外，还有另外一点：
- `s/explain`, `s/explain-data`会自动打印验证结果
- `s/valid?`, `s/conform`并不会。

所以，在命令行运行`(s/explain spec value)`会打印出两个值。

## 跨文件/命名空间使用`spec`

如果定义未限定命名空间的`spec`，会自动将其解析到当前命名空间。如果想要在另一命名空间使用，则必须引入当前命名空间，如：

```clj
;; my.domain
(s/def ::like #{:orange :apple :pear})
;; my.core
(ns my.core
  (:require [my.domain]))
(s/explain :my.domain/like :apple)

;; also you can
(ns my.core
  (:require [my.domain :as md]))
(s/explain ::md/like :apple)
```

如果使用了限定命名空间的`spec`，同样需要引入当前命名空间，但是使用方式有所不同：

```clj
;; my.domain
(s/def :animal/dog #{:name :age})
;; my.core
(ns my.core
  (:require [my.domain]))
(s/explain :animal/dog :name)
```

## multi-spec

`multi-spec`基于clojure的多态特性。使用multimethod是一种快速在代码里面引入`polymorphism`的方法。

```clj
;; 定义一些spec
(s/def :event/type keyword?)
(s/def :event/timestamp int?)
(s/def :search/url string?)
(s/def :error/message string?)
(s/def :error/code int?)
```
定义多态函数。使用`defmulti`和`defmethod`。

相关函数：
```clj
(defmulti name docstring? attr-map? dispatch-fn & options)
;; name:  mutilmethod fn name
;; docstring and attr-map: optional.
;; dispatch-fn: 确定使用哪个函数操作传入参数。该函数获取`dispatch-fn`的名称或者叫`dispatch-value`
;; options：key-vals，如
;;   - :default 默认的处理参数的函数。如没有指明，则为 :default
;;   - :hierarchy **不知道何用**

(defmethod multifn dispatch-val & fn-tail)
;; multifn: defmulti 中的 name
;; dispatch-val: 之前 dispatch-fn 返回的值。如果与该函数`dispatch-val`相同，则该函数会被调用。也可以定义一个`dispatch-val` 为 `:default` 的一个函数，作为默认处理函数。
;; fn-tail: 具体的处理函数。可以传入参数，在调用`defmulti-fn`时传入。
```

开始定义我们的`spec` multimethod:

```clj
;; :event/type 一个keyword函数对象，作为`dispatch-fn`. 与我们之前定义的
;; (s/def :event/type keyword?)
;; 无关。
;; 例如， 传入 {:event/type :search},则可以获取`:search`.
(defmulti event-type :event/type)
;; 不要使用"event/search" 这类`dispatch-val`，会比较难以使用`generator`生成样例。
;; 当然也可以自定义 `generator` 实现。
(defmethod event-type :search [_]
  (s/keys :req [:event/type :event/timestamp :search/url]))
(defmethod event-type :error [_]
  (s/keys :req [:event/type :event/timestamp :error/message :error/code]))
```

定义`multi-spec`.

相关函数：
```clj
(multi-spec mm retag)
;; mm: spec keyword
;; retag：
;;   - 使用`generator`生成样例时，作为`dispatch-val`的keyword, 被`assoc`进生成的样例里面
;;   - 如果使用`spec`作为keyword，还有过滤功能。不会生成不满足`spec`的`dispatch-val`对应的method的测试样例。
```

开始定义：
```clj
;; 使用:event/type, 能更好地生成样例。因为 :envent/type 会作为 dispatch-val 的键值
;; 直接包含进样例，从而使得这些样例更易符合`spec`。因为`spec`要求必须存在`:search`和`:error`
;; 两个keyword dispatch-val, 依靠随机生成概率很低。
(s/def :event/event (s/multi-spec event-type :event/type))
```

生成测试样例：
```clj
(gen/sample (s/gen :event/event))
;;=> 
;; ({:event/type :P/J, :event/timestamp -1, :error/message , :error/code -1, :type :error}
;;{:event/type :E/!, :event/timestamp 0, :search/url m, :type :search} {:event/type :R/U4, :event/timestamp 0, :error/message Sv, :error/code 0, :type :error} ...)
```
