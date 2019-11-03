# Async

## 重要概念

- `blocking`: 阻塞。`process`被阻塞，则当前线程被阻塞。
- `parking`: 停泊。例如，对于两个`processe`： A 和 B， 假设它们通过`channel`通信。如果 A 被阻塞，将其拿出当前线程； 执行 B，当其被阻塞，放回 A 继续执行。

`blocking`通过`thread`实现； `parking`通过`go`实现。需要注意的是：
执行很长的耗时任务，则使用`blocking`实现，因为`go`线程池中的线程数量有限。下面是一个例子：
>The reason you should use thread instead of a go block when you’re performing a long-running task is so you don’t clog your thread pool. Imagine you’re running four processes that download humongous files, save them, and then put the file paths on a channel. While the processes are downloading files and saving these files, Clojure can’t park their threads. It can park the thread only at the last step, when the process puts the files’ paths on a channel. Therefore, if your thread pool has only four threads, all four threads will be used for downloading, and no other process will be allowed to run until one of the downloads finishes.

## `alts!!` or `alt!`

其接受一个`channel`的`vector`， 如果哪个`channel`的任务先完成，则返回该`chanel`及`put`进去的值。

**用法一：**

最基本的用法，如：

```clj
(defn upload
  [headshot c]
  (go (Thread/sleep (rand 100))
      (>! c headshot)))

 (let [c1 (chan)
      c2 (chan)
      c3 (chan)]
  (upload "serious.jpg" c1)
  (upload "fun.jpg" c2)
  (upload "sassy.jpg" c3)
   (let [[headshot channel] (alts!! [c1 c2 c3])]
    (println "Sending headshot notification for" headshot)))
; => Sending headshot notification for sassy.jpg
```

**用法二：**

使用`timeout`创建`channel`，超时自动关闭，此时`value`为`nil`.

```clj
(let [c1 (chan)]
  (upload "serious.jpg" c1)
  (let [[headshot channel] (alts!! [c1 (timeout 20)])]
    (if headshot
      (println "Sending headshot notification for" headshot)
      (println "Timed out!"))))
; => Timed out!
```

**用法三：**

指定`put` 操作。 此时，如果返回是指定`put`操作的`channel`，则`value`为`true`(成功)或者`false`(失败).

```clj
(let [c1 (chan)
      c2 (chan)]
  (go (<! c2))
   (let [[value channel] (alts!! [c1 [c2 "put!"]])]
    (println value)
    (= channel c2)))
; => true
; => true
```
