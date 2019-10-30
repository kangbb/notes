# 测试方面

**Note:** Flex容器(`container`)，flex项目(`item`)。容器内部的子元素称为项目。

## flex与元素自身宽高

- `flex`布局，设置`align-items: "center"`等，即设置了交叉轴上的对其方式。则必须为`item`设置宽或高（根据交叉轴的方向，交叉轴方向上必须设置值），否则会出现`item`“消失”的情况。当然，`item`子元素也可以，它会撑起父元素。
- `flex`布局,没有设置交叉轴对齐方式及`item`宽或高，则会在交叉轴方向撑满父元素；设置了交叉轴对齐方式，则会使用元素自身在交叉轴方向上的值（宽或高）。
- `flex`布局，主轴方向上设置宽或高值是无效的。
- 对于`react native`，设置`flex:1`则默认该元素作为Flex容器，并且`flex-direction: "column"`。对于其中的元素，都会自动默认为`item`，因为如果子元素如果没有设置交叉轴方向的值(宽或高)，则会在该方向自动占满容器；同时，你也会发现元素自动在主轴方向排列，即使是块元素（`react native`应该都是块级元素？），设置了`justify-content`之后便会真正验证猜测。

**Note:** 这些和网页布局是有区别的。网页布局中，`item`无法同时作为`container`和`item`。

## flex与position

- 使用`flex:0`，作为`item`，如果没有设置宽和高则会直接“消失”；如果设置了主轴方向的值（宽或高），则主轴方向使用该值，交叉轴方向占满父元素；如果同时设置了主轴、交叉轴方向的值（即同时设置宽高），则会使用自己的宽和高。
- 如果同时使用`position`布局，则会导致自身“消失”，对其他`item`没有影响。即在`container`上设置`position:"relative"`，在`item`上设置`postion: "absolute", top: 30(或者没有top)`。设置宽或高都无法使其恢复。
- `item`是可以又作为`item`，又作为`postion`布局中的父元素，即我们一般设置`position:relative`的元素。子元素在使用`postion`布局时，如果没有设置主轴方向的值，则主轴的`justify-content`设置仍对元素生效；交叉轴方向同理。记住一点，此时`item`子元素默认`flex:0`。
- 一个`container`，其内部同时有`item`，又有应用`position`布局的元素。则`item`元素位于`position`元素的上方,它们的位置互不干扰。这个和网页布局一样，`position:absolute`导致元素脱离了文档流。`item`足够大时，会覆盖`position`元素的位置。这个其实就是`react navigation`中`header`和整个`layout`的布局原理(因为`headerLeft`or`headerRight`同时会侵占`headerTitle`和`content`的空间)。
- 容器不需要设置`position:relative`也可以进行`position`定位。
- `react native` 不支持`position:fixed`。

具体原理和CSS层叠有关。

## flex与margin, padding

- `flex`布局，`item`平分除去`margin`后剩下的空间。即无论一个`item`设置的`margin`多大，它的宽高都和同级的`item`相同。
- `flex`布局，`padding`则会增大一个`item`。即一个`item`设置的`padding`越大，则其有的空间越大。
