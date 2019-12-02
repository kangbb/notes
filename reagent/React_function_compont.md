# React Funtion Component

## `Form-1`, `Form-2` and `Form-3` all `React class Component`

参考：[https://betweentwoparens.com/what-the-reagent-component](https://betweentwoparens.com/what-the-reagent-component)

## Create and Use `React Function Component`

创建和使用:

```clj
;; This is React function component. Can't use Ratoms here!
(defn example []
  (r/as-element
    [:> rn/View
      [:> rn/Text "Function Component"]])
;; Reagent component
(defn reagent-component []
  [:> rn/View
   ;; Note :> to use a function as React component
   [:> example]])

;; 区分
(defn reagent-component []
  [:> rn/View
    [example]])
```

参考：[https://github.com/reagent-project/reagent/blob/master/doc/ReactFeatures.md#hooks](https://github.com/reagent-project/reagent/blob/master/doc/ReactFeatures.md#hooks)

## 其他

如果`React`函数接受函数组件作为参数，可以写如下组件作为参数：

```clj
(defn Home
  []
  (r/as-element
    [:> rn/View]))
```

如果`React`函数接受类组件作为参数，可以写如下组件作为参数(必须进行转换):

```clj
(defn Home
  []
  [:> rn/View])
(def app (r/reactify-component Home))
```
