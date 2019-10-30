//// six anchor char, ^ $ \b \B (?=p) (?!p)
//// ES6 also has (?<=p) (?<!p)
//// 位置只是一个空字符，而不是获取某个位置上操作字符串的值
//// 例如： "hello".match(/(?=ell)/),仅仅是获取`e`前的位置，而不是字符`h`

// test position feature
// can be seen as null char, but can't only for thier own place
// 可以视作空字符，但是只有在他们自己的位置上才可。
// 例如，把 ^ & 加到正则表达式中间，则其不为空字符
var pat = /^^^^hello$$/
console.log(pat.test("hello")) //=>true

pat = /^he^^ll$o$$/
console.log(pat.test("he^^ll$o")) //=>false

pat = /^hello/g
console.log("hello123".match(pat))
pat = /^^^hello/g
console.log("hello123".match(pat))
pat = /hello$/g
console.log("123hello".match(pat))

var result = "hello".replace(/^|$/g, '#');
console.log(result);

// 位置的含义
pat = /(?=ell)/
console.log("hello".match(pat))
console.log("hello".replace(pat, '#'))

pat = /(?=he)^^he(?=\w)llo$\b\b$/g
console.log("hello".match(pat))

// 数字分段
var s = "123456789"

// 先尝试
console.log(s.match(/\d{3}/g)) // => [ '123', '456', '789' ]
console.log(s.match(/(\d{3})+$/g)) // => [ '123456789' ]
console.log(s.match(/(\d{3})+/g))  // => [ '123456789' ]
console.log(s.match(/(?=(\d{3}))/g)) // => [ '', '', '', '', '', '', '' ]
// console.log(s.replace(/(?=(\d{3}))/g, "#"))
console.log(s.match(/(?=(\d{3})+)/g)) // => [ '', '', '', '', '', '', '' ]
console.log(s.match(/(?=(\d{3})+$)/g)) // => [ '', '', '' ]

// 综上可知， 正常情况下 /(\d{3})+/会进行贪婪匹配
// 但是 锚字符 使得其进行懒惰匹配。为什么会获取到7个位置？ 因为默认从`7`开始获取每个字符串前的位置，`789`正好匹配，接着是`678`，......
// 当设置了开始匹配的起点时，就只获取到了3个位置。这是因为`？=`后正则表达式的意义有所变化，`(\d{3})+)`和 `(\d{3})+$)`意义明显不同

pat = /(?!^)(?=(\d{3})+$)/g
// 获取3个数字之前的一个位置，该位置前还有一个位置，且其不在 字符串开头(^)之前。
console.log(s.replace(pat, ",")) // => 123,456,789
// 我们还可以添加
// 获取3个数字之前的一个位置，该位置前还有一个位置，且其不在4之前， 在该位置之前还有一个位置， 且其不在 字符串开头(^)之前。
// 其实，三个位置后面的值是同一个。 例如 "234"， 在2和3之间可以有无数个位置。
pat = /(?!^)(?!4)(?=(\d{3})+$)/g
console.log(s.replace(pat, ",")) // => 123456,789

// 考虑位置字符和其他正则表达式组合
var p_pat_1 = /^[0-9A-Za-z]{6,12}$/
console.log(p_pat_1.test("aAaaabz")) // => true
console.log(p_pat_1.test("123233Az,")) // => false
// 考虑以下两种方式的区别
// p_pat_2 表示 开头位置之前，还有一个位置，该位置后面紧跟了一个数字
// p_pat_3 表示 开头位置之前，还有一个位置，该位置后面紧跟了一个字符串，其中包含一个数字
var p_pat_2 = /(?=[0-9])(^[0-9A-Za-z]{6,12}$)/g
var p_pat_3 = /(?=.*[0-9])(^[0-9A-Za-z]{6,12}$)/g
console.log(p_pat_2.test("aA2aaabz")) // => false
console.log(p_pat_3.test("aA3aaabz")) // => true

// 默认为模糊匹配
// 精确匹配需要使用^和$搭配
var h_pat = /\d/
console.log(h_pat.test("2")) // =>true
console.log(h_pat.test("2345")) // =>true
console.log(h_pat.test("hello 2 world")) // =>true. 匹配到了2

// 多个分组的关系
// 先匹配前一个分组，从操作字符串匹配完第一个分组的位置后，继续匹配下一个分组
var group_pat_1 = /^[A-Za-z0-9]{6,8}$/
var group_pat_2 = /^\w{6,8}$/
var group_pat = /(^[A-Za-z0-9]{6,8}$)(^\w{6,8}$)/
var group_pat_normal = /([A-Za-z0-9]{6,8})(\w{6,8})/
console.log(group_pat_1.test("Asd1234"))
console.log(group_pat_2.test("Asd1234"))
console.log(group_pat.test("Asd1234")) // =>false
console.log(group_pat_normal.test("Asd1234")) // =>false

// 我们来写一下密码的正则表达式吧
// 使用 (?=p)
var p_pat = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])^[0-9a-zA-Z]{6,12}$/
console.log(p_pat.test("aaabbb")) // 只包含小写字母 false
console.log(p_pat.test("AAABBB")) // 只包含大写字母 false
console.log(p_pat.test("112233")) // 只包含数字 false
console.log(p_pat.test("123Abc")) // 同时包含 true
// 使用 (?!p)
p_pat = /(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/
