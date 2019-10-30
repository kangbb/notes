# js/{namespace}的秘密

## js/{namespace}的原理

访问`javascript`的全局的对象(global objects)，或标准内置对象, 以及一些全局对象（global object)的方法属性。全局对象的方法和属性，可能根据运行环境(runtime evironment)的不同而有所差异，如在浏览器(window object)中，可以使用`js/alert, js/document, js/window`等，在node.js(node object)中不可以。(repl cli模拟的为node环境)

## js/{namespace}可使用的范围

`JavaScript`定义的标准内置对象：<br/>
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

`JavaScript window`对象的属性方法：<br/>
[https://developer.mozilla.org/en-US/docs/Web/API/Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)

`Javascript global`对象的属性方法：<br/>
[https://nodejs.org/api/globals.html](https://nodejs.org/api/globals.html)

## 总结

- 当然，有些方法属性也是无法访问的，需要根据情况去确定。
- 不要将`syntax`内容和内置对象、对象的属性方法搞混。例如无法通过`js/async`实现javascript操作，因为其是语法内容。
