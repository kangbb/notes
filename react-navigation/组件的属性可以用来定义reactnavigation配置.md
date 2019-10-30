# 重点
- `React Component`可以通过属性`.navigationOptions`属性设置其值

例如：

```js
class HomeScreen extends React.Component {
  render () {
    return (
      <View>
        <Text>Home</Text>
      </View>
    )
  }
};

HomeScreen.navigationOptions = ({naviagtion}) => ({
  tabBarLabel: '首页',
  tabBarIcon: ({focused, tintColor}) => (
    <TabBarItem
      tintColor={tintColor}
      focused={focused}
      normalImage={require('./assets/home.png')}
      selectedImage={require('./assets/home.png')}
    />
  )
});
```

# 更多

文中已经提到了，它是组件的一个静态属性：<br/>
[https://reactnavigation.org/docs/en/headers.html](https://reactnavigation.org/docs/en/headers.html)
