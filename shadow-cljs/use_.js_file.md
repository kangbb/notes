# 使用`.js`文件

## 使用方式

shadow-cljs支持使用`.js`文件，使用方式为：

project structure
```sh
|--my-app
|--src
|  |--my_app
|  |  |--core.cljs
|  |--js
|  |  |--foo.js
```
则，在`core.cljs`中使用：
```clj
(ns my-app.core
  (:require ["/js/foo" :as foo]))
```
此时，可以使用`foo.js`中定义的函数了。

注意：`.js`必须定义在`class-path`中，具体含义如下
> The same classpath rules apply so the file may either be in your :source-paths or in some third-party .jar library you are using.

例如：

```sh
# 项目架构
server
├── js
│   └── bar.js
├── src
│   └── server
│       └── main.cljs
```

```clj
;; main.clj
(ns server.main
  (:require ["/bar.js" :as bar :refer (hello)])) ;; "/bar" 也可以
(defn main!
  []
  (println bar)
  (hello))
```

```clj
;; shadow-cljs.edn
(def ....
  {:source-paths ["src" "js"]
    ...})
```

- 如果不加`/`，会被识别为`node_modules`中的一员
- 如果在当前文件夹下，可以直接使用`./`。
- 注意，搜索顺序：当前文件夹、`source-paths`按序搜索、`node_modules`。

## 缺点

- 不支持`ES6` `class`语法

## 解决方案

> [https://shadow-cljs.github.io/docs/UsersGuide.html#_javascript_dialects](https://shadow-cljs.github.io/docs/UsersGuide.html#_javascript_dialects)
