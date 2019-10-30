# Expo Camera

## ratio

- 如果使用默认的`ratio`, Andriod画面拉伸问题，所以需要手动添加`ratio`参数.
- 注意`getSupportedRatiosAsync`返回的是一个手机支持的`ratio`，并非是适合当前手机相机的`ratio`。

## 使用`ref`异步方法

必须在相机`running`之后才能使用，否则会报错：

```sh
#object[Error Error: Camera is not running]
```

例如：`getSupportedRatiosAsync`， `getAvailablePictureSizesAsync`。

所以使用的位置不能在`componentDidMount`,会报错。应该在
`onCameraReady`参数中使用。

## 在`bottom tab`中使用相机的方法

对于`react navigation`来说，一般`bottom tab`中每个`tab`都包含一个`stack`。当三个`statck`第一次被激活(点击`tab`)后， 它们的`initialRoutName`都处于活跃状态。如果某个`stack`的`initialRoutName`中使用了组建，则会导致无法将其卸载问题。

### 方法一

在`createBottomTabNavigator`中为`BottomTabNavigatorConfig`添加`resetOnBlur`。请参考：

- [https://reactnavigation.org/docs/en/bottom-tab-navigator.html](https://reactnavigation.org/docs/en/bottom-tab-navigator.html)

当然，一旦切换`tab`, 会将切出的`tab`对应的navigator卸载。例如从`user`切换到`home`,则`user`会被切换卸载。

### 方法二

使用`withNavigationFocus`方法。页面获取焦点，渲染`Camera`；页面使用焦点，渲染另一个组件。请参考：

- [https://reactnavigation.org/docs/en/with-navigation-focus.html](https://reactnavigation.org/docs/en/with-navigation-focus.html)

使用`clojurescript`写的一个例子：

```clj
(defn camera
  []
  (if (-> (r/current-component)
          .-props
          .-isFocused)
    [:> Camera {:useCamera2Api true
                :ratio "16:9"
                :style (.-absoluteFillObject ^js StyleSheet)
                :on-mount-error (fn [err]
                                  (println err))
                :on-bar-code-scanned (fn [^js obj]
                                       (println (.-data obj)))}
     [:> rn/View {:background-color "rgba(0,0,0,0)"
                  :style {:flex 1}}]]
    [:> rn/View {:background-color "rgba(0,0,0,1)"
                 :style {:flex 1}}]))

defn page []
  (let [has-camera-permission (r/atom nil)]
    (r/create-class
      {:component-did-mount (fn [this]
                              (let [perm (js->clj permission :keywordize-keys true)]
                                (promise-> #(println %)
                                           ((:askAsync perm) (:CAMERA perm))
                                           (fn [value]
                                             (let [status (:status (js->clj value :keywordize-keys true))]
                                               (reset! has-camera-permission (identical?
                                                                               status
                                                                               "granted")))))))
       :reagent-render              (fn []
                                      (let [perm @has-camera-permission]
                                        (case perm
                                          nil [:> rn/View]
                                          false [:> rn/Text "No access to camera"]
                                          [:> (withNavigationFocus (r/reactify-component camera))])))
       :component-did-update (fn [this old-argv] (println "update"))})))
```

### 方法三

将`Camera`组件所在页面和`BottomTabNavigator`放在同一个`StackNavigator`中，原先的`tab`用另一个`stack`代替，内容随意。自定义`tab navigation`，点击
对应`tab`时，跳转到`Camera`组件所在页面，返回时使用`pop`方法。
