# 简记

## navigationOptions

- `header`中的`headerTitle`预置了左右`offset`的值，预置了`width`和`height`。当设置`left:0`则和`headerLeft`相邻，反之亦然。
- `headerTitleContainerStyle`设置`left: 0, right: 0`，则会使得`HederTitle`变大，覆盖空白位置。
- `headerLeft`和`headerRight`的`width`和`height`跟随内容。`width`值过大，会覆盖`headerTitle`。
- `headerLeftContainerStyle`和`headerRightContainerStyle`设置`padding`可以改变位置，同样也会撑大元素。
- 通过设置`headerLeft`和`headerRight`的`margin`也可以起到相同的效果。
- `headerLeft`和`headerRight`的`width,height,padding`过大会使得子元素脱离其自身，并不会被撑大。

事实上，也许`padding`足够小时并没有起作用。
* 基于`rn/Image`测试。