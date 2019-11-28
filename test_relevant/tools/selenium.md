# Selenium

## 简单介绍

参考链接：[https://juejin.im/post/5ce50c57e51d4556dc293582](https://juejin.im/post/5ce50c57e51d4556dc293582)

## 使用

参考：[https://selenium.dev/documentation/en/getting_started/](https://selenium.dev/documentation/en/getting_started/)

方便的方式：

- maven， `pom.xml`引入
- 安装对应的`driver`。安装最行版本
- 配置路径。(Mac可以直接使用`brew`安装，免于配置)

## TroubleShooting

### Mac `Path` 配置失效

参考：[https://blog.csdn.net/nijun914/article/details/75808459](https://blog.csdn.net/nijun914/article/details/75808459)

### `Mac`无法启动 `浏览器 driver`

通常报错：
> “chromedriver” cannot be opened because it is from an unidentified developer.

利用`Finder`进入该可执行文件所在的目录，执行`右键->open`
