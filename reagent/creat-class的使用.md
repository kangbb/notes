# 使用方法

## 方法

- `:render`键作为渲染函数，可以获取`this`；只能传递`this`
- `:reagent-render`键作为渲染函数，不能获取`this`，可以传递多个参数
- `r/current-component`不能在`create-class`中使用，在`create-class`外使用获取的并非其内部的`this`
- `r/state`获取`cljsState`值。在`reagent`中，以`this.cljsState`作为状态管理变量，其为一个`ratom`。
- `r/state-atom`获取`cljsState`本身。
- `r/set-state`设置`cljsState`的值。
- `r/replace-state`替换`cljsState`的值。

## 示例

```clj
(defn QR-code
  "docstring"
  [navigation state]
  (r/create-class
    {:get-initial-state (fn [this]
                          {:has-camera-permission nil
                           :type (-> (t/->cljs camera/Camera)
                                     (get-in [:Type :back]))
                           :name ""})
     :component-did-mount (fn [this]
                            (println (r/state this)))
     :component-will-update (fn [this new-argv]
                              (println (r/state this)))
     :render (fn [this]
               [:> rn/View
                [:> rn/Button {:on-press (fn []
                                           (r/set-state
                                             this
                                             {:name (str (:name (r/state this)) "test")}))
                               :title "add"}]
                [:> rn/Text (:name (r/state this))]])
      :display-name "qr-code"})) ; use display-name to give a tag for dev logs.
```

## 替代

使用`with-meta`添加生命周期函数作为作为元数据。问题在与`this`的共享问题；当然使用`form-2`的`local-state`方法替代也可以。例如：

```clj
(fn outer-component [arg1 arg2]
  (let [local-state (atom {})] ; Perform setup, etc.
    [(with-meta
       (fn inner-component []
         [:div (str arg1 "," arg2 "," @local-state)])
       {:component-did-mount
        (fn [this]
          ;; Has access to local-state (but doesn't currently trigger)
          )})]))
```
需要注意的是：
- 需要使用`[]`使得 `with-meta`部分强制渲染。
- `inner-component` 不能直接传递`out-component`传递进来的参数，只能直接访问。
- 但是，这样也会造成一些问题。和`form-2`的形式相悖。如此，`arg1, arg2, arg3`都只会保持初始值，而不会因为传入值的改变而改变。

参考：[https://github.com/reagent-project/reagent/issues/47](https://github.com/reagent-project/reagent/issues/47)

### 一个简单的示例

对于`form-2`或许并不是简单明了的理解，以一个简单的例子解释：

```clj
(defn m-view [name age]
  (println "child outer component" name)
  (let [like (r/atom "")]
    (fn [name age]
      (println "child inner component" name)
      [:> rn/View {:style {:margin-top 100}}
       [:> rn/Text name]
       [:> rn/Text age]])))

(defn user [x y]
  (let [name (r/atom "Jack")
        age (r/atom 23)]
    (fn []
      (println "parent component" x)
      [:> rn/View {:style {:margin-top 100}}
       [m-view @name @age]
       [:> rn/Button {:on-press (fn []
                                  (reset! name (str @name "apple ")))
                      :title "test"}]])))
```

如果`m-view`中`let`内部的函数并不传递`name, age`，那么其中`Text`渲染的值将永远是`jack 23`; 如果传递，则渲染的值会随着传入值的改变而改变。

如果使用`with-meta`代替`create-class`，如下：

```clj
(defn m-view [name age]
  (println "child outer component" name)
  (let [like (r/atom "")]
    (with-meta
      (fn [name age]
        (println "child inner component" name)
        [:> rn/View {:style {:margin-top 100}}
         [:> rn/Text name] ; <------ nil
         [:> rn/Text age]]) ; <----- nil
      {:component-did-mount (fn [this]
                              (println "in did mount: " name))})))
```
`name`和`age`都将是`nil`。所以，使用这种方式需要注意。

## 其他替代方案

参考：[https://github.com/reagent-project/reagent/issues/47#issuecomment-61056999](https://github.com/reagent-project/reagent/issues/47#issuecomment-61056999)

## 更多

reagent.core: [https://github.com/reagent-project/reagent/blob/master/src/reagent/core.cljs](https://github.com/reagent-project/reagent/blob/master/src/reagent/core.cljs)
