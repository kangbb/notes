# 重点
实际上， `cljs`使用`JavaScript`原生包需要为其提供`externs`文件。即使设置了`auto-infere:true`，也只能作用于简单的情况(**哪些情况？**)<br/>
## 使用方式
**Way1**
>CLJS Libraries: 
>[http://cljsjs.github.io/](http://cljsjs.github.io/)<br/>
>How To Use:
>[https://github.com/cljsjs/packages/wiki/Using-Packages](https://github.com/cljsjs/packages/wiki/Using-Packages)

**Way2**
>编译器的支持。如`shadow-cljs`，可以使用简单的方式使用：<br/>
>[https://shadow-cljs.github.io/docs/UsersGuide.html#_simplified_externs](https://shadow-cljs.github.io/docs/UsersGuide.html#_simplified_externs)

**Way3**
>既然`JavaScript`包导出的都是对象，那么便可以使用对象的属性来获取对应的导出方法。当然该方法待验证，例如：
>```clj
>;; 调用方法
>(.createElement React arg)
>;; 获取属性
>(aget React "Component")
>```

## 导入方式

不论何种方式，它们的导入方式都相同，即：
```clj
(ns namespce
  (:require ["library-name" :as alias-name]))
```
例如：
```clj
(ns my-app.core
  (:require ["React" :as react]))
```
语言的自动推断功能，使得我们通过一些简单的方式使用它的一些功能：
```clj
(ns my-app.core
  (:require ["React" :as react]
            [reagent.core :as r]))
(defn Hello
  []
  [:> react/Text "Hello"])
```
