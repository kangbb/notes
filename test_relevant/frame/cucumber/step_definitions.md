# Step definition

`Step definition`中的要素主要包括：

- preposition or adverb (eg,`When, Then,...`)
- expression (link to `*.feature`, Regexpr or Cucumber Expr)
- arguments (can pass more than one)
- step result(eg, `success, fail, undefined, pending, skipped, ambiuous`)
- hooks (eg, `Before, After, BeforeStep, AfterStep, around, ...`)
- tag
  - only used for `Feature, Scenario, Scenario Outline, Examples` and expression
  - inheritance
  - functionality or usage:
    - [Running a subset of scenarios](https://cucumber.io/docs/cucumber/api/#running-a-subset-of-scenarios)
    - [Restricting hooks to a subset of scenarios](https://cucumber.io/docs/cucumber/api/#conditional-hooks)
  - syntax: infix boolean expression
    - [https://cucumber.io/docs/cucumber/api/#tag-expressions](https://cucumber.io/docs/cucumber/api/#tag-expressions)
- options/configurations

