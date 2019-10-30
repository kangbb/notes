# 使用`.js`文件

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

注意：`.js`必须定义在`src`文件夹下。

**但是不支持`ES6` `class`语法**