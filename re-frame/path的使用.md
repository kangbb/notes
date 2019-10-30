# USAGE

```clj
;; 只能用于":db", 如果"coffects"或"effects"中没有":db"则，无法使用，因为不会"back-in"
(path :some) ; 获取 {:db {:some ...} }
(path [:some :to]) ; 获取 {:db {:some {:to ...}}}
(path [:some :to] :here) ; 获取 {:db {:some {:to ...} :here ...}}
```
