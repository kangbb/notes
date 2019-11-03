# Concurrency

三个工具：

- futures
- delays
- promise

可以将三个事件解耦：

- Task definition
- Task excution
- Require the task's result

## Futures

定义一个`task`，并放进另一个`thread`，不需要立即获得结果。

```clj
(future (Thread/sleep 4000)
        (println "I'll pring after 4 seconds"))
(println "I'll print immediately")
```

使用`deref`获取值，会阻塞当前线程：

```clj
(let [result (future (println "this println once")
                     (Thread/sleep 3000)
                     (+ 1 1))]
  (println "The result is: " @result)
  (println "It will be at least 3 seconds before I print"))
; => "this prints once"
; => The result is: 2
; => It will be at least 3 seconds before I print
```

## Delays

> Delays allow you to define a task without having to execute it or require the result immediately. 

- `delay`: just definite a task
- `force`: excute the task. 对一个`task`使用多次，`delay`作用的部分只会计算一次
- `deref/@`: only get the ref value or return value.

```clj
(def jackson-5-delay
  (delay (let [message "Just call my name and I'll be there"]
           (println "First deref:" message)
           message)))

jackson-5-delay
; => #object[clojure.lang.Delay 0x63631185 {:status :pending, :val nil}]

(force jackson-5-delay)
; => ; => First deref: Just call my name and I'll be there
; => "Just call my name and I'll be there"

@jackson-5-delay
; => "Just call my name and I'll be there"

(def gimli-headshots ["serious.jpg" "fun.jpg" "playful.jpg"])
(defn email-user
  [email-address]
  (println "Sending headshot notification to" email-address))
(defn upload-document
  "Needs to be implemented"
  [headshot]
  true)
(let [notify (delay ➊(email-user "and-my-axe@gmail.com"))]
  (doseq [headshot gimli-headshots]
    (future (upload-document headshot)
            ➋(force notify))))
;;; ➋ 只会执行一次
```

## Promises

> Promises allow you to express that you expect a result without having to define the task that should produce it or when that task should run.

`Promise`不需要定义一个`task`.

- `promise`: 定义一个`promise`
- `deliver`: 向`promise`传值
- `deref/@`: 获取`promise`中的值. 获取不到值，会产生`block`，阻塞线程。

```clj
(def my-promise (promise))
(deliver my-promise (+ 1 2))
@my-promise
; => 3
```
