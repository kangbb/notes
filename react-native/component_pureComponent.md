# `Component`和`pureComponent`
**`pureComponent`实现了`shouldComponentUpdate`的功能。**<br/>
组件`state`，`props`包含的状态较多时，每次更新会有些多余的**比较**，**渲染**。通过自定义`shouldComponentUpdate`，可以自定义需要比较、更新的状态，如下自定义只有`color`和`count`变化时，更新组件。`pureComponent`帮助我们省去了这些比较的代码。如：

component
```js
class CounterButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {count: 1}
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {return true;}
    if (this.props.count !== nextState.count) {return true;}
    return false;
  }
  render () {
    <Button color={this.props.color}
            onClick={() => this.setState(state => {count: state.count + 1})}>
      {this.state.count}
    </Button>
  }
}
```

pureComponent
```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1}
  }
  render () {
    <Button color={this.props.color}
            onClick={() => this.setState(state => {count: this.state.count + 1})}>
      {this.state.count}
    </Button>
  }
}
```
由于`props`来自父组件，如果传递其`state`进来，则`props`可变；`state`维护`CounterButton`自身状态，可变。所以，需要根据`props`和`state`判断组件自身是否需要更新。`PureComponent`则代替`ShouldComponentUpdate`做到了这一点。

## `pureComponent`存在的问题
- `shallowEqual`，浅比较。如`props`或`state`中的状态是一个引用类型，浅比较会出错。如：
  ```js
  handleClick() {
    const words = this.state.words; // words指向this.state.words; const 保证引用相同的对象
    words.push("like"); // 改变this.state.words;与concat不同
    this.setState({words: words}) // 改变state,但是还是指向同一个words对象。 
  }
  ```
- 可以使用`immutable`数据的思想，每次产生一个数据，而不是改变之前的数据。如：
  ```js
  handleClick() {
    const words = this.state.words; // words指向this.state.words; const 保证引用相同的对象
    this.setState({words: words.concat("like")}) // 改变state,但是还是指向同一个words对象。 
    // this.setState(state => {words: state.words.concat("like")})
  }
  ```
- 关于浅比较
  >当组件更新时，如果组件的 props 和 state 都没发生改变，render 方法就不会触发，省去 Virtual DOM 的生成和比对过程，达到提升性能的目的。具体就是 React 自动帮我们做了一层浅比较：
  >```js
  >if (this._compositeType === CompositeTypes.PureClass) {
  >  shouldUpdate = !shallowEqual(prevProps, nextProps)
  >  || !shallowEqual(inst.state, nextState);
  >}
  > ```
  >而 shallowEqual 又做了什么呢？会比较 Object.keys(state | >props) 的长度是否一致，每一个 key是否两者都有，并且是否是一个引>用，也就是只比较了第一层的值，确实很浅，所以深层的嵌套数据是对比不>出来的。

## 特殊的`shouldComponentUpdate`机制

- 为什么不能直接操作`props`或`state`来改变组件状态，使得组件重新渲染？因为`props`和`state`是引用类型，直接改变自身，它们还是指向之前的对象，比较时会发现没有什么变化。例如：
  ```js
  var a = {name:"jack", age: 12};
  a.sex = "man";
  a === a // true 
  ```
