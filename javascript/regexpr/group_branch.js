// group
var regex = /(ab)+/g;
var string = "ababa abbb ababab";
console.log( string.match(regex) ); 
// => ["abab", "ab", "ababab"]

// branch
var regex = /^I love (JavaScript|Regular Expression)$/;
console.log( regex.test("I love JavaScript") ); // => true
console.log( regex.test("I love Regular Expression") ); // => true

// quote
// 在正则表达式相关函数里引用
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( string.match(regex) ); // => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]

var result = string.replace(regex, "$2/$3/$1");
console.log(result); // => "06/12/2017"

// 在正则表达式中引用
// 注意里面的\1，表示的引用之前的那个分组(-|\/|\.)。不管它匹配到什么（比如-），\1都匹配那个同样的具体某个字符。
var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var string1 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
console.log(regex.test(string1)); // true
console.log(regex.test(string2)); // true
console.log(regex.test(string3)); // true
console.log(regex.test(string4)); // false

// 括号嵌套
// 引用不存在的分组
// 非捕获分组
var regex = /(?:ab)+/g;
var string = "ababa abbb ababab";
console.log( string.match(regex) ); // => ["abab", "ab", "ababab"]

// 首字母大写
function titleize(str) {
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function(c) {
		return c.toUpperCase();
	});
}
console.log( titleize('my name is epeli') ); 
// => "My Name Is Epeli"

// 驼峰化
function camelize(str) {
	return str.replace(/[-_\s]+(.)?/g, function(match, c) {
		return c ? c.toUpperCase() : '';
	});
}
console.log( camelize('-moz-transform') ); // => "MozTransform"
console.log( camelize('is-moz-transform') ); // => isMozTransform
// replace 没有被替换的则不会改变

// 中划线化
function dasherize(str) {
	return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
console.log( dasherize('MozTransform') ); 
// => "-moz-transform"
