# 方法
```clojure
(.fn obj arg...) ; 调用函数
(.-fn obj) ; 获取函数
```

# 注意
虽然使用`(.-fn obj arg...)`可以获取函数，但是如下方式调用却会导致问题。
```clojure
((.-fn obj) arg...)
```
如果所调用的函数在某个位置使用了`this.funName`，则会出现`this is null`的错误。所以需要避免。