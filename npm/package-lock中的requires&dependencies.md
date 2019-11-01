# package-lock中的requires&dependencies

package-lock中的requires和dependencies有什么区别？ 举个简单的例子：

```javascript
app
├── node_modules
│   └── expo
│       └── package.json
├── package.json
└── package-lock.json
```

在项目`app`中，依赖`expo`库，同时`expo`又存在其他的依赖关系。

该项目中所有的依赖都是安装在项目根目录下的`node_module`文件夹中。

所以，在`package-lock.json`中处理`expo`的依赖时：

- `requires`从`expo`文件夹下读取其`package.json`，获取依赖，作为其值。
- `dependencies`从`node_modules`文件夹下获取已安装的依赖库的信息，作为其值。实际上，如果安装版本和`requires`版本一致，`dependencies`值为nil。

实际上，由于一个项目有不同的依赖库，每个依赖库同时又有各自不同的依赖。所以，很可能存在版本冲突问题。
这时候，`dependencies`就会显示来自`node_modules`文件夹下的依赖库的版本信息。
