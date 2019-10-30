# defprotocol

```clj
(ns abstraction.defprotocol)

;;;; A multimethod is just one polymorphic operation
;;;; A protocol is a collection of one or more polymorphic
;;;; Multimethod perform dispatch on arbitrary value returned by a dispatching function,
;;;; this means every parameters passed to method must all pass to dispatching function,
;;;; but dispatching function only need to return dispatch-value, which is used to select method, rather than all

;;; defprotocol name,docstring,method-signature
;;; method-signature name, argument specification, docstring
;;; we can have more than one argument specification;
;;; argument specification can't have `& param`.

;;; It looks like a interface
(defprotocol Psychodynamics
  "Plumb the inner depths of your data types"
  (thoughts [x] "The data type's innermost thoughts")
  (feelings-about [x] [x y] "Feelings about self or others"))

;;; implement the protocol
;;; must implement all of the methods
;;; This use the first parameter to dispatch function, which means x must be a string
(extend-type java.lang.String
  Psychodynamics
  (thoughts [x] (str x " thinks, 'Truly, the character defines the data type."))
  (feelings-about
    ([x] (str x " is longing for a simpler way of life"))
    ([x y] (str x " is envious of " y "'s simpler way of life"))))

(println (thoughts "blorb"))
(println (feelings-about "schmorb"))
(println (feelings-about "schmorb" 2))
; (println (thoughts 2)) => throw an error

;;; we can use java.lang.Object to implement default dispatching.
;;; we can use more than one extend-type for a protocol
(extend-type java.lang.Object
  Psychodynamics
  (thoughts [x] "Maybe the Internet is just a vector for toxoplasmosis")
  (feelings-about
    ([x] "meh")
    ([x y] (str "meh about " y))))

(println (thoughts 3))
; => "Maybe the Internet is just a vector for toxoplasmosis"

(println (feelings-about 3))
; => "meh"

(println (feelings-about 3 "blorb"))
; => "meh about blorb"


;;; extend-protocol, implement multiple types

(extend-protocol Psychodynamics
  java.lang.String
  (thoughts [x] "Truly, the character defines the data type")
  (feelings-about
    ([x] "longing for a simpler way of life")
    ([x y] (str "envious of " y "'s simpler way of life")))

  java.lang.Object
  (thoughts [x] "Maybe the Internet is just a vector for toxoplasmosis")
  (feelings-about
    ([x] "meh")
    ([x y] (str "meh about " y))))

;;; `protocol`定义的方法属于`namespace`，而并非属于特定的`protocol`

```
