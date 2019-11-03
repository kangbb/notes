# OOP 和 FP

> In OOP, you think about data as something you can embody in an object, and you poke and prod it until it looks right. During this process, your original data is lost forever unless you’re very careful about preserving it. By contrast, in functional programming you think of data as unchanging, and you derive new data from existing data. During this process, the original data remains safe and sound.

面向对象编程， `data`在`object`中具現，不断被改变，最终符合要求;
函数式编程， `data`不可变，不断从旧数据衍生出新数据。

## FP: Pure Functions

定义，满足两个条件：

- It always returns the same result if given the same arguments. This is called `referential transparency`.
- It can’t cause any side effects. That is, the function can’t make any changes that are observable outside the function itself—for example, by changing an externally accessible mutable object or writing to a file.

