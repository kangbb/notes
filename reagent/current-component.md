# 获取`this`

- 组件直接作为参数传递给`js`世界，则`this`与`js`世界的内容基本相同。
- 非直接传递的，则获取的另一种形式`this.`例如如下形式：
  ```clj
  (def this-props #js {:argv
                     [
                      #object[navigation_app$pages$user$core$user]
                      #js{:pop                  #object[Function],
                          :popToTop             #object[Function],
                          :push                 #object[Function],
                          :replace              #object[Function],
                          :reset                #object[Function],
                          :dismiss              #object[Function],
                          :goBack               #object[Function],
                          :navigate             #object[Function],
                          :setParams            #object[Function],
                          :state                #js {:routeName user,
                                                     :key       id-1567148481853-2},
                          :router               nil,
                          :actions              #js {:pop       #object[pop],
                                                     :popToTop  #object[popToTop],
                                                     :push      #object[push],
                                                     :replace   #object[replace],
                                                     :reset     #object[reset],
                                                     :dismiss   #object[dismiss],
                                                     :goBack    #object[goBack],
                                                     :navigate  #object[navigate],
                                                     :setParams #object[setParams]},
                          :getParam             #object[Function],
                          :getChildNavigation   #object[getChildNavigation],
                          :isFocused            #object[isFocused],
                          :isFirstRouteInParent #object[isFirstRouteInParent],
                          :dispatch             #object[Function],
                          :getScreenProps       #object[Function],
                          :dangerouslyGetParent #object[Function],
                          :addListener          #object[addListener],
                          :emit                 #object[emit]}
                      {:routeName user, :key id-1567148481853-2}]})
  ```