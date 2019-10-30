# 传统UI编程与React UI编程

传统UI编程需要自己控制组件实例对应的DOM Node的创建、更新、销毁<br/>
React UI编程只需要描述组件实例及DOM Node即可，React会自动更新它们

# Element概念

描述组件实例和DOM Node的对象称为Element Tree。<br/>
Element 包含以下内容：
- DOM Element
- Component ELement

# Reconciliation

React渲染组件的方式。调用`ReactDom.render()`和`setState`时，都会引起`reconciliation`，React递归地解析Element Tree，从而了解自己需要渲染什么，然后把它们呈现到屏幕。

# Reference

[https://github.com/creeperyang/blog/issues/30](https://github.com/creeperyang/blog/issues/30)