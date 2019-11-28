# 状态管理

不同的`steps`和`scenario`之间存在数据共享和传递，我们该如何处理？这便是`state management`所做的事情。

## 在`Steps`之间共享数据

There is a lot of tools to resolve it:

[https://cucumber.io/docs/cucumber/state/#dependency-injection](https://cucumber.io/docs/cucumber/state/#dependency-injection)

For the `PicoContainer`, you can refer:

[http://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer](http://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer)

The crucial point for the above article:

- `PicoContainer` is invisible. Add a dependency of `cucumber-picocontainer` and make sure that the constructors for the step classes requires an instance of a the same class.
- `PicoContainer` conduct a DI by step definitions class constructor

## 在`Scenario`之间共享数据

一个`Scenario`执行完毕后，会`re-initialize data`后，再次执行另一个`Scenario`。例如：

实现下面的`*.feature`:

```feature
Feature: Add

  Test a add function

  Scenario: Test two number add
    Test tow number add

    Given I have a decimal 20.0
    When Giving me another decimal 40
    Then Return a result 60.1

  Scenario: Test new type
    Given I have a digit 2
    When Giving me another digit 3
    Then Return a digit 5
```

其`Step definitions`如下:

```java
package io.cpchain;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.Assert.*;

public class Stepdefs {
    private float num_1;
    private float num_2;

    private int digit_1;
    private int digit_2;

    @Given("I have a decimal {float}")
    public void i_have_a_decimal(float num_1, String tmp) {
        System.out.println(tmp);
        this.num_1 = num_1;
    }

    @When("Giving me another decimal {int}")
    public void giving_me_another_decimal(int num_2, String tmp) {
        System.out.println(tmp);
        this.num_2 = num_2;
    }

    @Then("Return a result {double}")
    public void return_a_result(double result) {
        assertEquals(num_1+num_2, result, 0.2);
    }

    @Given("I have a digit {digit}")
    public void i_have_a_digit(int digit_1) {
        System.out.print("Test sharing data between scenario: ");
        System.out.println(this.num_1);
        this.digit_1 = digit_1;
    }

    @When("Giving me another digit {digit}")
    public void giving_me_another_digit(int digit_2) {
        System.out.println(digit_2);
        this.digit_2 = digit_2;
    }

    @Then("Return a digit {digit}")
    public void return_a_digit(int res) {
        assertEquals(res, digit_1+digit_2);
    }
}
```

你会发现，在执行`@Given("I have a digit {digit}")`时，`this.num_1`值为`0.0`。进行了`re-initialized`。

在`Ruby`中，每个`Scenario`都在各自的`world`中执行，数据不共享；`java`中弱化了这一概念，但是其结果是一样的（都不共享数据）。

当然， 在`Scenario`共享数据是一件糟糕的事情。在需要的情况下，请`refactor`你的代码结构。参考：

[高赞回答](https://stackoverflow.com/questions/11164255/how-to-share-state-between-scenarios-using-cucumber)
