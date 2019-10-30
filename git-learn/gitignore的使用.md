# gitignore的使用

## 开头使用`/`避免递归匹配

例如本项目的结构：
```sh
./
├── index
│   ├── lib
│   │   ├── good.js
│   │   └── temp
│   └── temp
│       └── index.js
├── README.md
└── temp
    └── hello.js
```

如果`.gitignore`使用如下：

```.gitignore
temp
.gitignore
```

则会忽略两个`temp`文件夹和`lib`中的`temp`文件。

如果`.gitignore`使用如下：

```.gitignore
temp/
.gitignore
```

则会忽略两个`temp`文件夹。

如果`.gitignore`使用如下：

```.gitignore
/temp/
.gitignore
```

则只会忽略主目录下的`temp`文件夹。

## 匹配规则详解

`.gitignore`使用的规则是`glob`匹配。请参考：

- [https://rgb-24bit.github.io/blog/2018/glob.html](https://rgb-24bit.github.io/blog/2018/glob.html)
- [https://juejin.im/post/5c2797f8e51d45176760e2cf](https://juejin.im/post/5c2797f8e51d45176760e2cf)
