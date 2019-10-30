# 参考链接

[https://www.cnblogs.com/thinkam/p/8262743.html](https://www.cnblogs.com/thinkam/p/8262743.html)

# Javascript 和 Node模块的差异

参考：<br/>
[ES6 模块与 CommonJS 模块的差异](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)<br/>

## 区别

- Node 采用 CommonJS规范加载和导出模块
  - 参考：[https://www.runoob.com/nodejs/nodejs-module-system.html](https://www.runoob.com/nodejs/nodejs-module-system.html)
  - `module.exports`
    ```javascript
    var a = 3
    module.exports = a
    // 或者
    var b = 3
    var c = function() {
      console.log("hello")
    }
    module.exports = {
      b: b
      c: c
    }
    ```
  - `exports`
    ```javascript
    exports.world = function () {
      console.log("hello world!")
    }
    ```
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

## Node 运行包含`import/export`语法的JS文件方式

Node环境默认情况下无法运行包含`ES6`模块语法的JS文件。所以需要其他方式替代。
- 使用`node` + `--experimental-modules`运行。要求所有包含`ES6`模块语法的`js`文件均为`.mjs`后缀。
- 使用`babel-node`工具。参考：[https://juejin.im/post/5c4f0590e51d45299a08d2bc](https://juejin.im/post/5c4f0590e51d45299a08d2bc)
  - 安装
    ```sh
    # before 7.x version
    $ npm i -g babel-cli
    # after 7.x (include 7.x) version
    $ npm i -g @babel/core @babel/node
    ```
  - 安装`presets`并配置`.babelrc`文件
    ```sh
    # 文中推荐 2019.1
    $ npm i @babel/preset-env --save-dev
    # .babelrc，在项目目录/babel-node运行目录下设置
    {
      "presets": ["@babel/preset-env"]
    }
    ```
  - 注意只能用于调试环境

## commonJS模块规范

参考：[https://segmentfault.com/a/1190000010576927](https://segmentfault.com/a/1190000010576927)

## 关系参考

参考：[http://es6.ruanyifeng.com/#docs/module#%E6%A6%82%E8%BF%B0](http://es6.ruanyifeng.com/#docs/module#%E6%A6%82%E8%BF%B0)