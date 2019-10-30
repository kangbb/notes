# 使用javascript包-非externs
## 使用方式
**方式一：**
```clojure
;; 引入外部npm包
(def ReactNative (js/require "react-native"))
;; 获取对应的函数
(def Image (aget ReactNative "Image"))
```
根据[clojurescript API 文档](http://cljs.github.io/api/cljs.core/aget)， `aget`操作javascript `array`，所以如果npm包导出为数组形式，则可以使用该方式。<br />
<br />

**方式二：**
```clojure
;; 引入外部npm包
(ns react-native.core
  (:require [goog.object :as gobj]))

(def ReactNative (js/require "react-native"))
;; 获取对应函数
(def create-appcontainer (gobj/get ReactNavigation #js "Image"))
```
根据[clojurescript API 文档](http://cljs.github.io/api/cljs.core/aget)和[goole closure-library API 文档](https://google.github.io/closure-library/api/goog.object.html)。两种方式不能混淆，否则会获取到`nil`。

## 获取npm包导出形式
我们经常会使用`IDE`自带的`引用查看`功能去查看npm包的引用情况。但是这不总是有效的，因为有的npm包不总是将所有导出模块内容放置于`dist/`文件夹下，甚至你查看的到的或许是`.ts`等形式的文件。那么如何获取呢？<br />
作为`clojure`的爱好者，`cljsjs`封装了很多`javascript`包，它们给出了具体方式，[Creating Packages](https://github.com/cljsjs/packages/wiki/Creating-Packages)是为`cljsjs`做贡献的入门指南之一。以此，方式，我们查到了`react-native`的导出形式：[https://unpkg.com/react-native@0.60.4/Libraries/react-native/react-native-implementation.js](https://unpkg.com/react-native@0.60.4/Libraries/react-native/react-native-implementation.js)。<br />
接下来，你也可以通过这种方式对要使用的包做出自己的判断啦！