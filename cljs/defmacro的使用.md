# `defmacro`的使用

## 语法
### `

**\`** 相当于`quote`，阻止一个`list`求值。如下：

```clj
user=> (let [x 2] `(inc x))
(clojure.core/inc user/x)
```

### `~`

`~` 相当于`unquote`，对表达式求值。如下：

```clj
user=> (let [x 2] `(inc ~x))
(clojure.core/inc 2)
```

### `~@`

`~@`相当于`unquote-slice`，对一个`coll`求值。如`map`, `vector`, `list`,`set`等。将其每一个`entry`拆开来。如下：

```clj
user=> `(foo ~[1 2 3])
(user/foo [1 2 3])
user=> `(foo ~@[1 2 3])
(user/foo 1 2 3)
```

### `#`

在表达式末尾添加`#`，使用`gensym`生成一个`unique symbol`。避免和已定义的变量名称产生冲突。

```clj
user=> `(let [x# 2] x#)
(clojure.core/let [x__339__auto__ 2] x__339__auto__)
```

### `list`

也可以用`list`代替部分 **\`** 去实现部分功能。如：

```clj
(defmacro add
  [a b]
  (list + a b))

;; 同
(defmacro add
  [a b]
  `(+ ~a ~b))
```

## `'`

`quote`， 经常用于`symbol`和`list`。不计算其值，直接返回：

```clj
(defmacro add
  [a b]
  '(+ a b))

'(1 2 3)
;=> (1 2 3)
```

## 使用

请定义在`.clj`或`.cljc`文件中。

参考：

[https://cljs.github.io/api/cljs.core/defmacro](https://cljs.github.io/api/cljs.core/defmacro)

[https://clojureverse.org/t/how-to-define-and-use-a-macro-in-both-clj-and-cljs/2896](https://clojureverse.org/t/how-to-define-and-use-a-macro-in-both-clj-and-cljs/2896)

[https://blog.fikesfarm.com/posts/2018-08-12-two-file-clojurescript-namespace-pattern.html](https://blog.fikesfarm.com/posts/2018-08-12-two-file-clojurescript-namespace-pattern.html)

## 调试

在`cljs`中，无法通过`repl`直接使用macro. 请在实际运行环境中使用：

```clj
(println (macroexpand '(marco-name arg1 arg2 ...)))
```

## 参考

参考：

[https://aphyr.com/posts/305-clojure-from-the-ground-up-macros](https://aphyr.com/posts/305-clojure-from-the-ground-up-macros)

[https://cljs.github.io/api/syntax/#quote](https://cljs.github.io/api/syntax/#quote)

