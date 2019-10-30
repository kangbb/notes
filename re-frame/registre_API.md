# SOME API

## `reg-event-db`

```clojure
;;; `handler` is a function: (db event-vector) -> db
;;;(fn [db event]
;;;   ... return updated db)

(reg-event-db
   :load-defaults
   (fn [db _]
     (let [val (js->clj (.getItem js/localStorage "defaults-key"))]  ;; <-- Problem
       (assoc db :defaults val))))
; not a goog function
```

## `reg-event-fx`

```clojure
;;; `handler` is a function: (coeffects-map event-vector) -> effects-map
;;; (fn [coeffects event]     ;; first arg is often abreviated to cofx 
;;;    ... return a map of effects)

(reg-event-fx                     ;; note: -fx
   :load-defaults
   (fn [cofx event]                 ;; cofx means coeffects
     (let [val (:local-store cofx)  ;; <-- get data from cofx
           db  (:db cofx)]          ;; <-- more data from cofx
       {:db (assoc db :defaults val)}))) ;; returns an effect

```

