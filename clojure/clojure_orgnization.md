# clojure orgnization

`clojure`中的`function`和`data`组织方式。

## `namespace`

和命名空间交互：

- `(ns-name *ns*)`: 获取当前命名空间名称
- `(ns-interns *ns*)`: 获取当前命名空间的`symbol-var` map.
- `(ns-map *ns*)`: 获取所有的命名空间可解析的所有`symbol`有关的`symbol-var` map.

其实`namespace`提供了一张记录的表：
> symbol -> var -> object

通过`def`来`store a object`，这个过程称为`interning var`。

```clj
(def great-books ["East of Eden" "The Glass Bead Game"])
; => #'user/great-books

great-books
; => ["East of Eden" "The Glass Bead Game"]

(ns-interns *ns*)
; => {great-books #'user/great-books}

(deref #'user/great-books)
; => ["East of Eden" "The Glass Bead Game"]

@#'user/great-books
; => ["East of Eden" "The Glass Bead Game"]
```

使用`deref`或者`@`可以获取`var`指向 (point to) 的 object.

> This is like telling Clojure, “Get the shelf number from the var, go to that shelf number, grab what’s on it, and give it to me!”

创建命名空间：

- `create-ns`: just create
- `in-ns`: create and switch it
- `ns`: a macro

使用非限定命名空间(unqualified-namespace) symbol：

- `clojure.core/refer`: 引入一个命名空间的所有`symbol`，可使用附加选项`:only, :exclude， :rename`等。
  ```clj
  (clojure.core/refer 'cheese.taxonomy :rename {'bries 'yummy-bries})
  bries
  ;=> RuntimeException: Unable to resolve symbol: bries
  ```
- `clojure.core/alias`: 给予命名空间别名。用法：`alias ns-alias ns`

定义命名空间私有函数：

- `defn-`

## 在文件系统中引入`namespace`

- `require`和 `refer` = `use`
- `require`和 `alias` = `require :as`

`ns` macro 的 优势：

- `ns` does is refer the `clojure.core` namespace by default. You can control what gets referred from `clojure-core` with `:refer-clojure`, which takes the same options as refer:
  ```clj
  (ns the-divine-cheese-code.core
  (:refer-clojure :exclude [println]))
  ```

6个附加选项：

- `(:refer-clojure)`
- `(:require)`
- `(:use)`
- `(:import)`
- `(:load)`： 忽略
- `(:gen-class)`
