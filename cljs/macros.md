# macros

## 规则和书写

参考本文件夹：`defmacro_defn.md`和`defmacro的使用.md`, 以及 `clojure`文件夹下的`macros.md`。若有争议，以最后一个文件为主。

## 使用

可以同时在定义`macro`的命名空间和其他命名空间使用。这里可以参考：
> ClojureScript namespaces can require macros from the selfsame namespace, so long as they are kept in different compilation stages. So, for example a foo.cljs or foo.cljc file can make use of a foo.cljc or foo.clj file for its macros.

如何在其他命名空间使用：

- `require`和`:as`， 通过别名使用
- `require`和`：include-macros true`, 通过`:refer` 引入
- `:require`搭配`：refer-macros`
- `:require-macro`，可以搭配`:refer`
- `use-macros`和`:only` (`:only`强制附加)

## 参考

- [http://cljs.github.io/api/cljs.core/ns](http://cljs.github.io/api/cljs.core/ns)
- [https://clojurescript.org/guides/ns-forms](https://clojurescript.org/guides/ns-forms)
- [https://blog.fikesfarm.com/posts/2018-08-12-two-file-clojurescript-namespace-pattern.html](https://blog.fikesfarm.com/posts/2018-08-12-two-file-clojurescript-namespace-pattern.html)

不过请注意编译器的区别。例如，只有`shadow-cljs`便不支持如下方式。

在`Macros` guide 中提到：

```clj
;;; foo/core.cljs
(ns foo.core
 (:require-macros foo.core))

(defmacro add
  [a b]
  `(+ ~a ~b))

;;; bar/core.cljs
(ns bar.core
  (:require [foo.core :as foo]))

(foo/add 2 3)
```

但是在`.cljc`中，可以使用如下方式弥补实现：

```clj
(ns foo.core
 #?(:cljs (:require-macros foo.core)))
```

> 以上据此参考：[https://clojurescript.org/guides/ns-forms#_implicit_sugar](https://clojurescript.org/guides/ns-forms#_implicit_sugar)

关于`#?`，请参考：

[https://clojure.org/guides/reader_conditionals](https://clojure.org/guides/reader_conditionals)

**注意：**

- 推荐使用`.cljc`文件格式。可以兼容各种编辑器。
- 使用`.clj`文件时，无法引入`cljs`的库，实现的功能有限制。例如，我想利用`org.clojure/core.async`库，但是属于`cljs`，所以无法使用。(**附一**)
- 使用`.clj`文件时，无法通过`:require`引入（应该是`shadow-cljs`的限制）

附一：

请注意，在`unqoute sytax`中，除了`if`, `when`等`special form`，其他没有被求值 (在`symbol`前存在`～`符号)，则会自动解析到当前命名空间，即使通过`require`引入的变量也一样。

所以，实际上在宏中，必须使用命名空间限定的`binding`. 例如， 使用`go`, 请使用`cljs.core.async.macros/go`。

## 与`clojure`的不同

- `clojure`可在定义`macro`的命名空间中使用该`macro`
- `clojurescipt`必须在一个命名空间中定义，在另一个命名空间中使用。只是为了区分编译阶段。

## 其他

如下`macro`输出什么？

```clj
(defmacro result
  [expression]
  `(println (quote ~expression) "result is: " ~expression)
  `(println (js/Error. "error")))

;;;
(result (+ 2  5))
```

只会打印一个`js Error`. 显然，只有返回的宏才会被计算。

---
`macro`只做代码替换，或者说生成代码，在一个`macro`中调用另一个`macro`也是相同的结果。如：

```clj
(defmacro add
  [expression]
  `~(let [res# expression]
      (list (second res#) (first res#) (last res#))))
;;; 更简单的版本
(defmacro add
  [expression]
  (list (second res#) (first res#) (last res#)))

;;; 使用
(defmacro composite
  []
  `(str "I like" (add (1 + 2))))
(println (macroexpand '(composite)))
;; (clojure.core/str I like (clojure.core/+ 1 2))

(defmacro composite
  []
  `(str "I like" ~(add (1 + 2))))

(println (macroexpand '(composite)))
;; (clojure.core/str I like 3)

```

经过`reader`处理的结果为`data structures`, 一般为`list`, 只有操作了这些`list`才会改变结果。
