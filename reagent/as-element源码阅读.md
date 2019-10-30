# 源码结构
```sh
reagent.core/as-element  #　调用和函数并form， "Turns a vector of Hiccup syntax into a React element. Returns form　unchanged if it is not a vector."
|--reagent.impl.template/as-element # 以form为参数，　函数中命名为x
|  |--reagent.impl.template/js-val? # 调用'identical?',如果是js object,则返回false; 否则返回true
|  |--reagent.impl.template/vector? # 如果为vector,返回true；拆分　hiccup vector
|  |--reagent.impl.template/seq? # seq?只对list判真, 如果为list则返回true;
|  |--reagent.impl.template/expand-seq-check　#　展开seq并检查，具体待深入
|  |  |--reagent.ratom/check-derefs 
|  |  |--reagent.ratom/expand-seq-dev # s为list, o为＃js{}; (dotimes [n 10] & body), for循环从０- n-1,执行循环体body. [n 10], bindings
|  |  |                               # $! reagent 安全方式对js　object属性赋值
|  |--reagent.impl.template/expand-seq
|  |--cljs.core/name? # 如果为symbol或keyword,返回其字符串形式，(def a (symbol "test")) (name a) 返回"test"
|  |--cljs.core/pr-tr # 需深入阅读
|  |-- # 否则　返回x

```
可结合函数运行情况探究