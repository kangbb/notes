# `babel`配置

## 配置文件叠加

1. `babel.config.js`是项目级的文件，位于根目录。`.babelrc`, `.babelrc.js`, `package.json`则是文件相关配置。

2. 叠加需要注意：

- Searching will stop once a directory containing a package.json is found, so a relative config only applies within a single package.
- The "filename" being compiled must be inside of "babelrcRoots" packages, or else searching will be skipped entirely.

真实含义是：

- `.babelrc` files only apply to files within their own package
- `.babelrc` files in packages that aren't Babel's 'root' are ignored unless you opt in with `"babelrcRoots"`.

例如：

```sh
.babelrc
packages/
  mod1/
    package.json
    src/index.js
  mod2/
    package.json
    src/index.js
```

`.babelrc`将不会对`mod1`和`mod2`生效。即遇到`package.json`停止搜索。
