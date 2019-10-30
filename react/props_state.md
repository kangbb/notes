# props要点

- props只读，无法修改
- 用于组件通信，自上而下流动

# state要点

- `state`无法直接更新，直接更新不会引起组件重新渲染
- 通过`setState`更新`state`， 并非是同步操作，异步进行。即调用了`setState`之后，再次访问`state`，不一定会看到更新之后的`state`
- 多个`setState`会合并
- state可以作为props传递给子组件, 其更新也会引起子组件的更新
- props数据流比作瀑布。state传递给子组件相当于在瀑布某个位置增加了一个水源，还是自上而下流动
- 每个组件都有自己的state，相互之间隔离，组件更新依靠state的更新，更新的内容只和屏幕上显示的内容有关。
  例如React Native中的`<TextInput />`，作为一个组件，有自己的`state`，它会依靠自身更新；曝露`value`属性可以改变`state`，即改变input中显示的内容；曝露的`onChangeText`可以获取用户输入，即获取下一个`state`。

# cljs中的组件

- 大部分时间使用的均为函数组件形式，可以参考类似操作
- 复杂的需要`create-react-class`形式，如何和es6形式对应？

# 其他

- 利用props和state结合可以写独立的可复用的组件

# 理解

React `class Component`中的 `render`相当于 `ReactDOM.render`，所以每次组件更新，必然会重新调用一次`render`函数来渲染组件。因此，下面两种写法相同：<br />

**写法一：**
```javascript
import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
   var {text} = this.state
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
        value={text}
      />
    );
  }
}
```
**写法二：**
```javascript
import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
      />
    );
  }
}
```
比较`TextInput`中的`value`传参方式。由于在`render`函数中获取`text`，所以每次获取新值，渲染组件，都会调用`render`，更新`text`值，所以以上两种写法等效。<br/>
<br/>
对于下面这种写法：
```javascript
import React, { Component } from 'react';
import { TextInput } from 'react-native';

var mText = 'Useless Placeholder';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => mText = text)}
        value={mText}
      />
    );
  }
}
```
虽然`mText`为全局变量，也改变了其值，但是并不会引起组件渲染。因为没有调用`setState`函数，`setState`不仅仅会更新`state`的值，也会触发组件渲染。

# React 提取组件

分析页面UI组成，将多次使用(可复用性)或较为复杂(简化页面)的组件提取出来，构建组件库。

# 受控组件维护自己的 state

如`<input>`、`<textarea>` 和 `<select>`等之类的表单元素。在`react native`中的`TextInput`等。<br/>
所以，使用`reagent`封装这些组件并使用这些组件时，它的更新由自己负责。

# Reference

- [https://zh-hans.reactjs.org/docs/rendering-elements.html](https://zh-hans.reactjs.org/docs/rendering-elements.html)
- [https://zh-hans.reactjs.org/docs/state-and-lifecycle.html](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)
