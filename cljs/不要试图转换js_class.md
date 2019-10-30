# `js->clj`的限制
尽管我们`js->clj`可以转换`js`类型到`cljs`类型。但是，有些情况下却无法实现。

## 使用`println`无法获取其实际值类型
例如，使用`reagent/create-class`函数创建组件，我们可以直接获取`this`,通过`println`打印：
```clj
(println this)
;=> #object[Object [object Object]]
```
无法显示其实际内容，通过`js-keys`获取其`key`，
```clj
(js-key this)
;=> #js [props, ...]
```
但是，我们使用`object?`判断其类型，却是`false`。
```clj
(object? this)
;=> false
```
此类`js`对象，无法通过`js->clj`进行类型转换。

不过，我们却可以像操作`js`对象一样对它们进行操作，获取值，修改值等。

## 使用`println`无法打印的类型

会报错`TypeError: TypeError: Cannot convert a symbol to a string`.
此类型只能通过`lib-name/fn-name`方式访问，如：
```clj
(ns app
  (:require ["react-native" :as rn]))

(defn title [item]
  [:> rn/Text item])
```

## 总结

以上两种类型都无法通过`js->clj`。却有共同的一点：
- 可以通过`lib-name/fn-name`。

所以，我们神奇的使用`this/state`获取到了`state`。

最后：
- 不要尝试通过转换类型，统一使用`cljs`的数据操作方式实现一切的数据操作。
