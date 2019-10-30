# 使用React系列的npm包
## 成熟的框架
om: [https://github.com/omcljs/om](https://github.com/omcljs/om)<br/>
reagent: [https://github.com/reagent-project/reagent](https://github.com/reagent-project/reagent)<br/>
后者的更新和活跃度都比前者要高，推荐后者。
## 非框架封装的包
除了`React`之外，还有很多基于`React`发展而来的工具，如`react navigation`, `react native`, `NativeBase`等，都没有这些框架封装。不过，这些框架却提供了一些方法，可以讲其他工具中的函数、类、接口，统一转换为`React`可渲染的组件、类、接口等。下面是`reagent`框架中的相关函数：
### "as-element"
转换为reagent element.
### "adapt-react-class"
转换为react class, 即类组件。关于`React`组件参考如下：<br />
[https://reactjs.org/docs/components-and-props.html](https://reactjs.org/docs/components-and-props.html)

### "as-component"
转换为reagent组件。
### "reactify-component"
转换为reagent组件。<br/>
<br/>
当然，最后三种方法有一定的区别，具体请参考: <br/>[https://github.com/reagent-project/reagent/blob/master/doc/InteropWithReact.md](https://github.com/reagent-project/reagent/blob/master/doc/InteropWithReact.md)<br />
关于组件(component)和元素(element)的区别，可以参考:<br/>
[https://github.com/creeperyang/blog/issues/30](https://github.com/creeperyang/blog/issues/30)

## `reagent`中如何使用`React`组件
学习`React`的第一步便是熟悉其组件的用法。reagent为使用`React`组件提供了三种方法：[CreatingReagentComponents.md](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md)<br/>
<br/>
当然，更简单的方式是使用其提供的两个函数：
- create-class
- create-element
请参考：[http://reagent-project.github.io/docs/master/reagent.core.html#var-create-class](http://reagent-project.github.io/docs/master/reagent.core.html#var-create-class)

## 学习`reagent`
Reagent: [https://github.com/reagent-project/reagent](https://github.com/reagent-project/reagent)<br/>
Tutorials and FAQ: [https://github.com/reagent-project/reagent/tree/master/doc](https://github.com/reagent-project/reagent/tree/master/doc)<br/>
API Documentation: [http://reagent-project.github.io/docs/master/](http://reagent-project.github.io/docs/master/)
