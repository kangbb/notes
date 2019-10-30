# JavaScript正则表达式

## 匹配规则

默认为`模糊匹配`，例如：

```javascript
var pat = /\d/
pat.test("2") //=> true
pat.test("23") //=> true
pat.test("hello 3 world") //=> true
```
由于所有字符串都包含了一个数字，所以`test`始终为`true`。如果需要精确匹配，请使用锚字符：`^`和`$`。

## 参考

- [https://juejin.im/post/5965943ff265da6c30653879#heading-17](https://juejin.im/post/5965943ff265da6c30653879#heading-17)
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)