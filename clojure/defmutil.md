# defmulti

```clj
(ns abstraction.were-creatures)

(defmulti full-moon-behavior
          (fn [were-creature]
            (:were-type were-creature)))

;;; for dispatch value :wolf
(defmethod full-moon-behavior :wolf
  [were-creature]
  (str (:name were-creature) "will howl and murder"))

;;; for dispatch value :simmons
(defmethod full-moon-behavior :simmons
  [were-creature]
  (str (:name were-creature) "will encourage people and sweat to the oldies"))

;;; for dispatch value nil
(defmethod full-moon-behavior nil
  [were-creature]
  (str (:name were-creature) "will stay at home adn eat ice cream"))

;;; for dispatch value default, when dispatch value can't be according to any.
(defmethod full-moon-behavior :default
  [were-creature]
  (str (:name were-creature) "will be the most likeable celebrity"))


(println (full-moon-behavior {:were-type :wolf
                              :name "Rachel from next door"}))
(println (full-moon-behavior {:were-type :simmons
                              :name "Andy the baker"}))
(println (full-moon-behavior {:were-type nil
                              :name "Martin the nurse"}))
(println (full-moon-behavior {:were-type :office-worker
                              :name "Jimmy from sales"}))

;;;; For variadic parameter

;;; dispatch fn arity must is the same as method.
;;; It's important, so the followings are wrong.
;(defmulti animal
;          (fn [type]
;            type))
;(defmethod animal :cat
;  [type like dislike]
;  (println (name type) " like " like " and dislike " dislike ", but is a cute pet"))
;
;(defmethod animal :dog
;  [type like dislike]
;  (println (name type) " like " like " and dislike " dislike ", but is a devoted pet"))
;
;(animal [:cat "fish" "apple"])

;;; You can use `& _` to represent the rest parameters.
(defmulti animal
          (fn [type & _]
            type))
(defmethod animal :cat
  [type like dislike feature]
  (println (name type) " like " like " and dislike " dislike ", but is a " feature " pet"))

(defmethod animal :dog
  [type like dislike]
  (println (name type) " like " like " and dislike " dislike ", but is a devoted pet"))

(animal :cat "fish" "apple" "cute")


;;; For multi dispatch value

(defmulti cup
          (fn [material feature]
            [material feature]))
(defmethod cup ["glass" "fragile"]
  [material feature]
  (println "Glass cup must be used carefully."))

(defmethod cup ["iron" "solid"]
  [material feature]
  (println "Iron cup is durable."))

(cup "iron" "solid")

;;; For hierarchical dispatching
;;; defmethod dispatch value compare by `isa?`, other than "="
;;; but `isa?` use `=` firstly, and then use hierarchy

;;; isa?
;;; Usage: (isa? child parent)
;;; (isa? h child parent)
;;; if h is not supplied, defaults to  the global hierarchy.
;;;
;;; defmulti derives a dispatch-value, and then use it to compare with
;;; each defmethod dispatch-value. So the latter is parent, the former is child

(derive java.util.Map ::collection)
(derive java.util.Collection ::collection)

(defmulti foo class)
(defmethod foo ::collection [c] :a-collection)
(defmethod foo String [s] :a-string)

(println (foo []))
(println (foo (java.util.HashMap.)))
(println (foo "bar"))

;; prefer-method define a priority of the method

(derive ::rect ::shape)

(defmulti bar (fn [x y] [x y]))
(defmethod bar [::rect ::shape] [x y] :rect-shape)
(defmethod bar [::shape ::rect] [x y] :shape-rect)

;; (bar ::rect ::rect)
;; 会出错，因为同时匹配到了两个函数
(prefer-method bar [::rect ::shape] [::shape ::rect])
(bar ::rect ::rect)
```
