# `defrecord`的使用

```clj
(ns abstraction.records)

;;;; create a record
(defrecord WereWolf [name title])

(println (WereWolf. "David" "London Tourist"))

;;; ->WereWolf and map->WereWolf are factory function.
(println (->WereWolf "Jacob" "Lead Shirt Discarder"))
(println (map->WereWolf {:name "Lucian" :title "CEO of Melodrama"}))

;;; 在另一个命名空间使用 如：
;(ns monster-mash
;  (:import [were_records WereWolf]))
;(WereWolf. "David" "London Tourist")

;;; 可以使用任何map的操作
;;; 可以使用对象的操作
;;; 访问性能比map高
```
