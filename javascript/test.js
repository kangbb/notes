// function test(name) {
//   return new Promise((resolve, reject) => {
//     console.log(name)
//     reject("reject")
//     resolve("resolve")
//   })
// }
// var a = test("Jack").then((value) => {
//   console.log(value)
// }, (value)=> {
//   console.log(value)
// })

// 定义 generator 函数
// function* helloWorldGenerator() {
//   yield 'hello';
//   yield 'world';
//   return 'ending';
// }

// var hw = helloWorldGenerator();
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())
// console.log(hw.next())
// function timeout(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function asyncPrint(value, ms) {
//   await timeout(ms);
//   console.log(value);
// }
// function my () {
//   timeout(150).then(()=>console.log("hello"))
// }
// my();
// asyncPrint('hello world', 50);
// console.log("test")

// import { ethers } from 'ethers';

// let randomWallet = ethers.Wallet.createRandom();
// console.log(randomWallet)
// randomWallet.signMessage()
// randomWallet.encrypt("Asd123", {scrypt: {N: 2, r: 1, p: 8}})
// .then((keystore)=>{
//   // console.log(keystore)
//   return ethers.Wallet.fromEncryptedJson(keystore, "Asd123")
// })
// .then((wallet)=>{
//   console.log(wallet.signingKey.publicKey)
// }, (err)=> {
//   console.log(err)
// })

// let data = {
//   query: `mutation {
//     AuthRequest(input: {document: {did: "test", publicKey: [{value: "b7df21b50a740930ff22db78a70c6d91aa75e11d3a5740208517236d548329caaeab00881dfa174d6286a2db5cfba18e793e572f7cb61d885a56a761acd825a2", controller: "test", type: ECC}]}}) {
//       did
//       nonce
//     }
// import { ethers } from 'ethers';

// let randomWallet = ethers.Wallet.createRandom();
// console.log(randomWallet)
// randomWallet.signMessage()
// randomWallet.encrypt("Asd123", {scrypt: {N: 2, r: 1, p: 8}})
// .then((keystore)=>{
//   // console.log(keystore)
//   return ethers.Wallet.fromEncryptedJson(keystore, "Asd123")
// })
// .then((wallet)=>{
//   console.log(wallet.signingKey.publicKey)
// }, (err)=> {
//   console.log(err)
// })
//   }`
import { ethers } from 'ethers';
let randomWallet = ethers.Wallet.createRandom();
randomWallet.encrypt("Asd123", {scrypt: {N: 2, r: 1, p: 8}})
.then((keystore)=>{
  // console.log(keystore)
  return ethers.Wallet.fromEncryptedJson(keystore, "Asd123")
})
.then((wallet)=>{
  console.log(wallet.signingKey.publicKey)
}).catch(err=>console.log(err))



// import { ethers } from 'ethers';

// let randomWallet = new ethers.Wallet('0x21f4eb2a6f9097ecbcb57c63d52cece32df111f726487adad2113dc1d0d56104');
// console.log(randomWallet)

// randomWallet.signMessage("did:cpc:a54F308B539C449F86FC1b1aE1eeD4DA27C8f275f9651b48-82da-4ff7-b433-3a7b242a8545")
// .then((keystore)=>{
//  console.log(keystore)
// })

// import { Base64 } from 'js-base64';

// console.log(Base64.encode('dankogai'));  // ZGFua29nYWk=
// console.log(Base64.encode('小飼弾'));    // 5bCP6aO85by+
// console.log(Base64.encodeURI('小飼弾')); // 5bCP6aO85by-

// console.log(Base64.decode('ZGFua29nYWk='));  // dankogai
// console.log(Base64.decode('5bCP6aO85by+'));  // 小飼弾
// // note .decodeURI() is unnecessary since it accepts both flavors
// console.log(Base64.decode('5bCP6aO85by-'));  // 小飼弾

// var enc = Base64.encode(JSON.stringify({
//   "vc": "eyJjbGFpbSI6ImV5SjBlWEJsSWpvZ0ltTnNZV2x0SUhSNWNHVWlMQ0FpZFhKcElqb2lZMnhoYVcwZ2RYSnBJaXdnSW1GamRHbHZiaUk2SW1OaGNpQmphR0Z5WjJVaUxDQWlhRzlzWkdWeUlqb2lkR1Z6ZENKOUNnPT0iLCJob2xkZXIiOiJ0ZXN0IiwiZXhwaXJlIjoiMjAyMC0wOS0yNFQwNjo1NzowMC4yODBaIiwic2lnbmF0dXJlIjoiNGQ1NzY3OWRiYTY3OWY3MTk0MjNjNmYwOTQ2MzVmMWQ3OGFjOWUyMDEyZmNmNzkzZWJlZTQxMWI5OWY1MTlhMmQ0ZTI4YmFiMWMzNDg4ZWFkYzkyNzhlNDE0NDk4MWUxMmNiMDc0MDI4YzFhYTgyM2UxZjBkOGJhNTg1YWIwNWQxYiJ9",
//   "expire": "2020-09-24T03:09:09.804Z",
//  var EC = require('elliptic').ec;
// var ec = new EC('secp256k1');
// // Generate keys
// var key = ec.genKeyPair();
// console.log(key)

// var pubPoint = key.getPublic();
// var x = pubPoint.getX();
// var y = pubPoint.getY();
// var pub = pubPoint.encode('hex');
// console.log(pub)        "signature": "0387db3de602562f3e4bc38aa189d2abede967c57fcab257c7b4aba159264c5bc4b58c03364aa0a2c4f75996961e7b159dd78baacb2c80b7ad49a62ddb86a2071c"
// }))

// console.log(enc)

// var res = Base64.decode("eyJjbGFpbSI6ImV5SjBlWEJsSWpvZ0ltTnNZV2x0SUhSNWNHVWlMQ0FpZFhKcElqb2lZMnhoYVcwZ2RYSnBJaXdnSW1GamRHbHZiaUk2SW1OaGNpQmphR0Z5WjJVaUxDQWlhRzlzWkdWeUlqb2lkR1Z6ZENKOUNnPT0iLCJob2xkZXIiOiJ0ZXN0IiwiZXhwaXJlIjoiMjAyMC0wOS0yNFQwNjo1NzowMC4yODBaIiwic2lnbmF0dXJlIjoiNGQ1NzY3OWRiYTY3OWY3MTk0MjNjNmYwOTQ2MzVmMWQ3OGFjOWUyMDEyZmNmNzkzZWJlZTQxMWI5OWY1MTlhMmQ0ZTI4YmFiMWMzNDg4ZWFkYzkyNzhlNDE0NDk4MWUxMmNiMDc0MDI4YzFhYTgyM2UxZjBkOGJhNTg1YWIwNWQxYiJ9")
// var cred = JSON.parse(res)
// console.log(cred)

// import ecc from 'eosjs-ecc'
// ecc.randomKey().then(privateKey => {
//   console.log('Private Key:\t', privateKey) // wif
//   console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...
//   })

// var EC = require('elliptic').ec;
// var ec = new EC('secp256k1');
// // Generate keys
// var key = ec.genKeyPair();
// console.log(key)

// var pubPoint = key.getPublic();
// var x = pubPoint.getX();
// var y = pubPoint.getY();
// var pub = pubPoint.encode('hex');
// console.log(pub)                    

// console.log(JSON.stringify(
//   {
//     location: "上海市闵行区紫竹科学园",
//     endpoint: "http://did.cpchain.io/api/v1",
//     verifier: "did:cpchain:0x403e7df19263d9d7646b11ebfc125f3dd6c08619",
//     supported_vc_type: "vehicle",
//     }))

// var date = new Date()
// console.log(date.toISOString())

// var validid = require('validid');
// console.log(validid.cnid('411224199606095615')); // return true

// import {ethers} from "ethers";
// console.log(ethers.utils.toUtf8Bytes("234242"))

// var regex = /\d?/g
// var my_regex = new RegExp("\\d{2,5}")

// var s = "234"
// console.log(s.match(regex))

// var time_reg = /^([01][0-9]|[2][0-3]):[0-5][09]$/

// var result = "hello\n".replace(/^|$/gm, '#');
// console.log(result); 
// => "#hello#"
// var s_reg = /(?<!l)/g
// var res = "hello".replace(s_reg, "#");
// console.log(res)

// var easy = /.^/g
// console.log("hello".match(easy))

// var result = "12345678".replace(/(?=\d{3})/g, ',')
// console.log(result); 

// var d = new Date("0019-10-08T08:03:24.925Z")
// console.log(d.getFullYear())

// var like = ()=> Promise.resolve(3)

// like().then((data) => {
//   Promise.reject(4)
//   return Promise.resolve("name")
// })
// .then((res) => {
//   console.log(res)
// })
// .catch((err)=>console.log(err))

// /**
// *
// * @param fn {Function}   实际要执行的函数
// * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
// *
// * @return {Function}     返回一个“去弹跳”了的函数
// */
// function debounce(fn, delay) {

//   // 定时器，用来 setTimeout
//   var timer

//   // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
//   return function () {

//     // 保存函数调用时的上下文和参数，传递给 fn
//     var context = this
//     var args = arguments

//     // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
//     clearTimeout(timer)

//     // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
//     // 再过 delay 毫秒就执行 fn
//     timer = setTimeout(function () {
//       fn.apply(context, args)
//     }, delay)
//   }
// }

// var a = 3
// var b = {a}
// console.log(b)
