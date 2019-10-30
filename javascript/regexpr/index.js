// 可用
const excludedChars = ["𥖄","𤰉"];
const excludedCharsStr = excludedChars.join('');
const reg = new RegExp(`^([\u3400-\u9fa5${excludedCharsStr}]){2,15}$`, 'g');
console.log(reg)

// 不可用
var reg_1 = "2323"
var reg_2 = /^d${reg_1}e$/
console.log(reg_2)

var m_reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)^\S{6,16}$/
console.log(m_reg.test("Asd123"))

// vin
import {valid_vin} from './vin_validate'
console.log(valid_vin("5J6HYJ8V55L009357"))

var s = "12324"
console.log(s[2] === 3)
console.log(s[2] === '3' )
console.log(s.match(/\d|[A-Z]/g))
console.log("403e7df19263d9d7646b11ebfc125f3dd6c08619".length)