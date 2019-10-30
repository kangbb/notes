# `defmacro`

## 与`defn`的区别

- `defn`被调用时，先计算(evalute)所有的参数(arguments)，然后计算/运行(evalute)函数体(body)；`defmacro`则是先进性代码转换，然后计算(evaluate)这些代码，并不会直接计算所有参数值，而是在函数体(body)中出现了则计算。
- `defmacro`的参数可能会被计算很多次。

**示例：**
```clj
;; 正确
(defmacro twice [e] `(do ~e ~e))
(twice (println "foo"))

;; 出错
(defn twice [e] `(do ~e ~e))
(twice (println "foo"))
```

参考：[https://stackoverflow.com/questions/3667403/what-is-the-difference-between-defn-and-defmacro](https://stackoverflow.com/questions/3667403/what-is-the-difference-between-defn-and-defmacro)

## 使用

只对`.clj`或`.cljc`文件有效。使用`：require-macros`或者在`：require`中包括`include-macros`、`refer-macros`。
