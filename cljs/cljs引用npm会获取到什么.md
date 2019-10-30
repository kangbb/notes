# `cljs`引用`npm`会获取到什么

## 无法使用`println`打印的`symbol`

如：
```clj
(ns app
  (:require ["react-native" :as rn]))
```

只能通过`lib-name/fn-name`获取内部变量、函数，如：
```clj
[:> rn/Text]
```

## 无法使用`println`打印实际内容的`object`

如:

```clj
(ns app
  (:require ["expo-camera" :as camera]))
```

可以通过`lib-name/fn-name`获取内部变量、函数；**也可以通过操作对象方式获得**。如：

```clj
camera/Camera

(aget camera "Camera")
```

## 一个`js`对象，可以打印

如：

```clj
(ns app
  (:reuqire ["expo-permissions" :as permission]))
```

## 总结

由于导入的内容不同，操作方式也不同。所以当无法获取需要的内容时，可以通过打印方式获取导入内容，从而确定使用方式。

## 参考

编译使用了`shadow-cljs`,而很多包使用了`ES6`导入导出模块，所以，该编译工具同样提供了一些相关的表作为使用这类`npm`包的指南，参考：

[https://shadow-cljs.github.io/docs/UsersGuide.html#_using_npm_packages](https://shadow-cljs.github.io/docs/UsersGuide.html#_using_npm_packages)

作者也同样支持使用`repl`打印查看导入内容，从而确定使用方式：

[https://shadow-cljs.github.io/docs/UsersGuide.html#_about_default_exports](https://shadow-cljs.github.io/docs/UsersGuide.html#_about_default_exports)

