# 关于 rswap!

两种特性:

- 总是返回`nil`
- 允许对同一个`ratom`递归地使用`rswap!`

example:

```clojure
; param [state [event-name id value]]
; 传入       ["like" ["love" "apple" "banana"]]
(defn event-handler [state [event-name id value]]
  (case event-name
	;assoc-in vector,则第2个参数[index key]
	;         map, 则第2个参数[key1 key2 ...] 嵌套并入 
	  :set-name   (assoc-in state [:people id :name]
                            value)
	  :add-person (let [new-key (->> state :people keys (apply max) inc)]
				  (assoc-in state [:people new-key]
							{:name ""}))
	state))

(defn emit [e]
  ;; (js/console.log "Handling event" (str e))
	; (swap! param f x)
	; (swap! param f x y)
	; (swap! param f)
  (r/rswap! app-state event-handler e))

(defn name-edit [id]
	; foo 里面包含atoms或ratoms, 其更新时, p会更新
  (let [p @(r/track person id)]
	[:div
	 [:input {:value (:name p)
			  :on-change #(emit [:set-name id (.-target.value %)])}]]))

(defn edit-fields []
  (let [ids @(r/track person-keys)]
	[:div
	 [name-list]
	 (for [i ids]
	   ^{:key i} [name-edit i])
	 [:input {:type 'button
			  :value "Add person"
			  :on-click #(emit [:add-person])}]]))
```
