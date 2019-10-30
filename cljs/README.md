# ClojureSript Learn
## 使用Javascript
### cljs与js的interop(互操作)
ClojureScript定义了特殊的`js`命名空间允许访问JavaScript类型/函数/方法/全局对象（即浏览器`window`对象）。例如:
```repl
# in repl
$ (.log js/console "Hello")
hello

# 访问js原生类型
$ js/String
$ js/Array

# 访问js方法
$ js/Math.PI
```

搭配宏命令,访问js对象的方法/属性。常用的为`.`和`..`。例如：
```
(def m "Hello World")
(.-length m)
;;=> 11

(.toUpperCase m)
;;=> "HELLO WORLD"

(.replace m "H" "")
;;=> "ello World"
```
具体参考：<br/>
[https://cljs.github.io/api/cljs.core/DOT](https://cljs.github.io/api/cljs.core/DOT)<br/>
[http://cljs.github.io/api/cljs.core/DOTDOT](http://cljs.github.io/api/cljs.core/DOTDOT)<br/>

同时，利用一些标记文法可以定义js类型、对象或者由clojureScript转换为JavaScript。如`#js [...]`, `#js {...}`, `cljs->js`函数等。具体可以参考：
[https://cljs.github.io/api/syntax/#Tagged%20Literals](https://cljs.github.io/api/syntax/#Tagged%20Literals)
<br />

其他参考链接：[https://segmentfault.com/a/1190000004315183](https://segmentfault.com/a/1190000004315183)

### 引用外部包-编写extern文件
参考链接：<br/>
[https://clojurescript.org/reference/dependencies](https://clojurescript.org/reference/dependencies)<br />
[https://clojurescript.org/reference/packaging-foreign-deps](https://clojurescript.org/reference/packaging-foreign-deps)

### 引用外部包-其他方式
如果外部包导出的模块为`object`形式，则可以用如下方式。如`react-native`:
```clj
(def ReactNative (js/require "react-native"))
(def AppRegistry (aget ReactNative "AppRegistry"))
```

### ClojureScript依赖和npm依赖：版本不同问题
能否解决呢？(优先npm依赖，excludes, cljsjs externs文件)

## 其他学习
reagent API等:<br/>
[http://reagent-project.github.io/](http://reagent-project.github.io/)<br/>
[http://reagent-project.github.io/docs/master/index.html](http://reagent-project.github.io/docs/master/index.html)<br/>
Hiccup语法:<br/>
[https://github.com/weavejester/hiccup](https://github.com/weavejester/hiccup)

## 接下来
TODO
- 阅读react native的源码，解析模块导出结构
- 阅读cljsjs的仓库社区，清楚各类npm包编写extern的方式 尤其是npm包转换代码的来源。
- 注意`clj->js`的操作，尤其是给javascript函数传值，不然可能报错
- Reference Type and other???
