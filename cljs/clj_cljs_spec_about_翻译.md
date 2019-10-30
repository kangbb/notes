# Problem

## Docs are not enough

```clj
(defn name
  "docstring"
  [arglist]
  )
```

- `docstring`只对用户有用，编译器无法使用
- Clojure 的类型检查是`runtime checking`，通过JVM本身的类型集合判定类型。类型提示、类型注解是相对困难。

## Map specs should be of keysets only

- 其他动态语言和clojure的类型检查区别

## Manual parsing and error reporting is not good enough

例如`macro`

## Generative testing and robustness

手写测试很累，但是`test.check`却能够自动生成测试样例并测试

## A standard approach is needed

除了`clojure.spec`并没有标准方法去实现`specification`和`testing`。

# Objectives
> 目标

- 在各种环境中统一`specification`
- 最大化`specification`的杠杆作用。一个`spec`应该自动实现：
  - Validation
  - Error reporting
  - Destructuring
  - Instrumentation
  - Test-data generation
  - Generative test generation
- 最小化的“入侵”。即定义的`spec`对于原代码、函数的影响最小，无需重新定义`fn/macro`。
- 组合不同的`key spec`来验证`map`
- ????

# Guidelines
> 指导方针，参考
- `spec`做边缘检测
- 表现力>正确性？ `spec`并非类型系统。
- 命名很重要。
- 使用命名空间限定的spec
- 不要为命名空间添加其他东西，如`meta`等
- 

