# 关系
- 所有的`sequences`都是`collections`。
- `sequences`包含的数据类型很多，参考:[https://www.brainonfire.net/files/seqs-and-colls/main.html](https://www.brainonfire.net/files/seqs-and-colls/main.html)
- 但是，`sequences`的相关方法并没有实现对所有类型`sequences`的判定。例如`seq?`判定`list`作为`sequences`。

## 杂项
`(first map)`返回`map`的第一个`entry`(元素，条目，项), 一个`key-value`的`vector`。`key`作用于`entry`。
```clj
(first {:name "jack" :age 23})
; => [:name "jack"]
(key (first {:name "jack" :age 23}))
; => :name
```

