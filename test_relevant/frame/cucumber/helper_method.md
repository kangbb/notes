# Helper Method
Helper method belongs to `glue code`. What't the meaning?

> 在程序设计中，粘合代码是不是为了满足程序的需求而设计编写的，而是<font color="red">**为了实现将不同部分的不兼容的代码“粘合在一起”而设计编写的**。</font>在编写代码过程中，粘合代码的出现是为了让存在的库或程序间进行交互，例如：像Java的外来的（如C++）本地功能接口（让本地C++API和JavaAPI粘合在一起了），或映射对象到数据库使用的面向对象映射（如：hbm.xml及JPA标准的类源文件中的注解,它们让SQL API和Java API粘合在一起了）,或集中成两个或更多个商业非专用的程序


> 粗燥一点可翻译为“粘合代码”，打个比方，你已经有实现了各个小功能的函数，但是你还需要将它们有机的“组合”起来实现一个大功能，这个“组合”的过程就是进行glue~

## `Cucumber`中使用

> In fact, it is recommended to refactor step definitions into helper methods for greater modularity and reuse. 

参考：[https://cucumber.io/docs/gherkin/step-organization/#helper-methods](https://cucumber.io/docs/gherkin/step-organization/#helper-methods)

