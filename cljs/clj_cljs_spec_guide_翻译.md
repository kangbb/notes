# spec Guid

> specification, 规范，规格

## Getting started

<font color="red">**The spec library specifies the structure of data, validates or conforms it, and can generate data based on the spec.**</font>

To use spec, declare a dependency on Clojure 1.9.0 or higher:

```clj
[org.clojure/clojure "1.10.0"]
```

To start working with spec, require the clojure.spec.alpha namespace at the REPL:

```clj
(require '[clojure.spec.alpha :as s])
```
Or include spec in your namespace:

```clj
(ns my.ns
  (:require [clojure.spec.alpha :as s]))
```

## Predicates(布尔函数)

> **`Predicate`**<br/>
>
> - predicate是一种布尔值函数，所谓布尔值函数，即自变量x映射到因变量y，y的取值是true或者false。
> - assertion是程序声明（statement）的一种，执行时检查某个predicate是否总为真，否的话程序报错。
> - 辨析，predicate的值可为true也可以为false，assertion所声明内容必须为真否则报错。
>
> 参考：[https://www.zhihu.com/question/25404942](https://www.zhihu.com/question/25404942)

Each spec describes a set of allowed values. There are several ways to build specs and all of them can be composed to build more sophisticated specs.
>简单`spec`可以组合复杂的`spec`

Any existing Clojure function that takes a single argument and returns a truthy value is a valid predicate spec.
> 解释了`predicate spec`的定义，即布尔函数。输入`x`，返回`true` or `fasle`

We can check whether a particular data value conforms to a spec using [conform](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/conform):
> 判断一个`x`是否符合(confirm)一个`spec`，使用
> ```clj
> (s/confirm spec x)
> ```

```clj
(s/conform even? 1000)
;;=> 1000
```
The `conform` function takes something that can be a spec and a data value.
> `conform`的调用方法。 

Here we are passing a predicate which is implicitly converted into a spec. The return value is "conformed". Here, the conformed value is the same as the original value - we’ll see later where that starts to deviate. If the value does not conform to the spec, the special value `:clojure.spec.alpha/invalid` is returned.
> 为`true`， 返回输入的`value`；为`fasle`，返回 `:clojure.spec.alpha/invalid`<br/>
> 实际上`even?`并非`spec`，会被隐式地(implicitly)转换为`spec`。`even?`即为`predicate`

If you don’t want to use the conformed value or check for :clojure.spec.alpha/invalid, the helper valid? can be used instead to return a boolean.
> 使用`s/valid?`效果相同，返回值不同，为`true` or `false`。

Note that again `valid?` implicitly converts the predicate function into a spec. The spec library allows you to leverage all of the functions you already have - there is no special dictionary of predicates. Some more examples:
> 并没有可用的`predicate`词典，但是存在的你都可以使用。

```clj
(s/valid? nil? nil)  ;; true
(s/valid? string? "abc")  ;; true

(s/valid? #(> % 5) 10) ;; true
(s/valid? #(> % 5) 0) ;; false

(import java.util.Date)
(s/valid? inst? (Date.))  ;; true
```
Sets can also be used as predicates that match one or more literal values:
```clj
(s/valid? #{:club :diamond :heart :spade} :club) ;; true
(s/valid? #{:club :diamond :heart :spade} 42) ;; false

(s/valid? #{42} 42) ;; true
```
> **`literal`**<br/>
>我作为"字面量“理解，即代表一些符号，如`43， ”string", 'c'`，常常赋值给变量。<br/>
> 参考:[https://www.iteye.com/blog/hax-160003](https://www.iteye.com/blog/hax-160003)

## Registry
> 注册表

Until now, we’ve been using specs directly. However, spec provides a central registry for globally declaring reusable specs. The registry associates a namespaced keyword with a specification. The use of namespaces ensures that we can define reusable non-conflicting specs across libraries or applications.
> `Reistry`的存在使得我们可以重用`specs`，它把一个命名空间中的`keyword`和一个`specification`相关联。使用命名空间后，可以定义无冲突的可重用的`specs`。

Specs are registered using `def`. It’s up to you to register the specification in a namespace that makes sense (typically a namespace you control).
> 自定义命名空间啦。

```clj
(s/def ::date inst?)
(s/def ::suit #{:club :diamond :heart :spade})
```

A registered spec identifier can be used in place of a spec definition in the operations we’ve seen so far - `conform` and `valid?`.

```clj
(s/valid? ::date (java.util.Date.))
;;=> true
(s/valid? ::date 42)
;;=> false

(s/conform ::suit :club)
;;=> :club
(s/conform ::suit "like")
;;=> :clojure.spec.alpha/invalid

(s/explain ::date (java.util.Date.))
;;=> Success!
(s/explain ::date 42)
;;=> 42 - failed: inst? spec: :spec-test.core/date
```
You will see later that registered specs can (and should) be used anywhere we compose specs.

---
**Spec Names**

In this guide we will often use auto-resolved keywords like ::date. The Clojure reader resolves these to a fully-qualified keyword using the current namespace. You may also see some cases where a fully-qualified keyword like :animal/dog is used to name a spec.

Generally, Clojure code should use keyword namespaces that are sufficiently unique such that they will not conflict with other spec users. If you are writing a library for public use, spec namespaces should include the project name, url, or organization such that you will not conflict. Within a private organization, you may be able to use shorter names - the important thing is that they are sufficiently unique to avoid conflicts.
> 使用`spec`要带命名空间，否则会在当前命名空间解析`resolve`。
> 例如，在命令行，命名空间为`user`:
> ```clj
> (require '[clojure.spec.alpha :as s])
> (s/def ::date inst?)
> (s/valid? ::date (java.util.Date.))
> ; => true
> ; ::date 被解析为`：user/date`
> ; 因此，也可以使用：
> (s/valid? :user/date (java.util.Date.))
> ```

---

Once a spec has been added to the registry, doc knows how to find it and print it as well:
```clj
(doc ::date)
-------------------------
:user/date
Spec
  inst?

(doc ::suit)
-------------------------
:user/suit
Spec
  #{:spade :heart :diamond :club}
```
> 妙啊

## Composing predicates

The simplest way to compose specs is with `and` and `or`. Let’s create a spec that combines several predicates into a composite spec with `s/and`:

```clj
(s/def ::big-even (s/and int? even? #(> % 1000)))
(s/valid? ::big-even :foo) ;; false
(s/valid? ::big-even 10) ;; false
(s/valid? ::big-even 100000) ;; true
```

We can also use `s/or` to specify two alternatives:

```clj
(s/def ::name-or-id (s/or :name string?
                          :id   int?))
(s/valid? ::name-or-id "abc") ;; true
(s/valid? ::name-or-id 100) ;; true
(s/valid? ::name-or-id :foo) ;; false
```

This `or` spec is the first case we’ve seen that involves a choice during validity checking. Each choice is annotated with a tag (here, between `:name` and `:id`) and those tags give the branches names that can be used to understand or enrich the data returned from `conform` and other spec functions.
> 使用`tag`, 对于一些`spec`函数更加友好。能让它们的返回值更加易懂可读。

When an `or` is conformed, it returns a vector with the tag name and conformed value:

```clj
(s/conform ::name-or-id "abc")
;;=> [:name "abc"]
(s/conform ::name-or-id 100)
;;=> [:id 100]
```

Many predicates that check an instance’s type do not allow nil as a valid value (`string?`, `number?`, `keyword?`, etc). To include nil as a valid value, use the provided function [nilable](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/nilable) to make a spec:
> `string?`, `number?`, `keyword?`等这一类`predicate`检查实例类型时，不允许其值为`nil`，如果为`nil`，同样会返回`false`（或同类返回值）。使用`s/nilable`可以避免。

```clj
(s/valid? string? nil)
;;=> false
(s/valid? (s/nilable string?) nil)
;;=> true
```

## Explain

[explain](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/explain) is another high-level operation in spec that can be used to report (to *out*) why a value does not conform to a spec. Let’s see what explain says about some non-conforming examples we’ve seen so far.
> 如果一个`value`不符合`spec`，则会给出原因。

```clj
(s/explain ::suit 42)
;; 42 - failed: #{:spade :heart :diamond :club} spec: :user/suit
(s/explain ::big-even 5)
;; 5 - failed: even? spec: :user/big-even
(s/explain ::name-or-id :foo)
;; :foo - failed: string? at: [:name] spec: :user/name-or-id
;; :foo - failed: int? at: [:id] spec: :user/name-or-id
```

Let’s examine the output of the final example more closely. First note that there are two errors being reported - spec will evaluate all possible alternatives and report errors on every path. The parts of each error are:

- `val` - the value in the user’s input that does not match

- `spec` - the spec that was being evaluated

- `at` - a path (a vector of keywords) indicating the location within the spec where the error occurred - the tags in the path correspond to any tagged part in a spec (the alternatives in an or or alt, the parts of a cat, the keys in a map, etc)

- `predicate` - the actual predicate that was not satisfied by val

- `in` - the key path through a nested data val to the failing value. In this example, the top-level value is the one that is failing so this is essentially an empty path and is omitted.

> 解释各个部分的含义。`in`应用于`Map`等嵌套类型的`spec`才会出现。例如：
>
> ```clj
> (s/def ::name string?)
> (s/def ::age pos-int?)
> (s/def ::profile (s/keys :req [::name ::age]))
> (s/valid? ::profile {::name "Roman" ::age 25.9})
> ;; false
> (s/explain ::profile {::name "Roman" ::age 25.9})
> ;; In: [:specs.profile/age]
> ```

For the first reported error we can see that the value `:foo` did not satisfy the predicate `string?` at the path `:name` in the spec `::name-or-id`. The second reported error is similar but fails on the `:id` path instead. The actual value is a keyword so neither is a match.

In addition to explain, you can use `explain-str` to receive the error messages as a string or `explain-data` to receive the errors as data.

```clj
(s/explain-data ::name-or-id :foo)
;;=> #:clojure.spec.alpha{
;;     :problems ({:path [:name],
;;                 :pred string?,
;;                 :val :foo,
;;                 :via [:spec.examples.guide/name-or-id],
;;                 :in []}
;;                {:path [:id],
;;                 :pred int?,
;;                 :val :foo,
;;                 :via [:spec.examples.guide/name-or-id],
;;                 :in []})}
```

---

This result also demonstrates the namespace map literal syntax added in Clojure 1.9. Maps may be prefixed with #: or #:: (for autoresolve) to specify a default namespace for all keys in the map. In this example, this is equivalent to {:clojure.spec.alpha/problems …​}
> 解释`map`命名空间的用法。

---

## Entity Maps

Clojure programs rely heavily on passing around maps of data. A common approach in other libraries is to describe each entity type, combining both the keys it contains and the structure of their values. Rather than define attribute (key+value) specifications in the scope of the entity (the map), specs assign meaning to individual attributes, then collect them into maps using set semantics (on the keys). This approach allows us to start assigning (and sharing) semantics at the attribute level across our libraries and applications.
> 对于其他的一些语言，通过`key+value(data structure)`的方式定义一个`entity`，会自动做静态类型检查。我们则定义每一个`attributue`的`spec`，再将其组合到`map`中，定义一个`entity`的`spec`。

For example, most Ring middleware functions modify the request or response map with unqualified keys. However, each middleware could instead use namespaced keys with registered semantics for those keys. The keys could then be checked for conformance, creating a system with greater opportunities for collaboration and consistency.

Entity maps in spec are defined with [keys](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/keys):

```clj
(ns my.domain (:require [clojure.spec.alpha :as s]))
(def email-regex #"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$")
(s/def ::email-type (s/and string? #(re-matches email-regex %)))

(s/def ::acctid int?)
(s/def ::first-name string?)
(s/def ::last-name string?)
(s/def ::email ::email-type)

(s/def ::person (s/keys :req [::first-name ::last-name ::email]
                        :opt [::phone]))
```

This registers a `::person` spec with the required keys `::first-name`, `::last-name`, and `::email`, with optional key `::phone`. The map spec never specifies the value spec for the attributes, only what attributes are required or optional.
> 定义一个`::person` spec， 使用`s/keys`将已注册`keys`对应的`spec`组合到一起。注意`:req`和`:opt`，如果没有它们，则默认`:req`。
>
> `:req`中的`spec`已经被满足，如果`value`中还包含其他`keyword`， 则结果依旧为`true`.
> 也就是说，`:req`只验证一个value必须包含的`keyword`对应的值是否满足`spec`.

When conformance is checked on a map, it does two things - checking that the required attributes are included, and checking that every registered key has a conforming value. We’ll see later where optional attributes can be useful. Also note that ALL attributes are checked via keys, not just those listed in the :req and :opt keys. Thus a bare (s/keys) is valid and will check all attributes of a map without checking which keys are required or optional.
> 使用`spec`时，会检查是否包含所要求的`attribute`, 且这些`attribute`是否满足注册的`keys`对应的`spec`。
> `：req`后的`attribute`是必须的。

```clj
(s/valid? ::person
  {::first-name "Bugs"
   ::last-name "Bunny"
   ::email "bugs@example.com"})
;;=> true

;; Fails required key check
(s/explain ::person
  {::first-name "Bugs"})
;; #:my.domain{:first-name "Bugs"} - failed: (contains? % :my.domain/last-name)
;;   spec: :my.domain/person
;; #:my.domain{:first-name "Bugs"} - failed: (contains? % :my.domain/email)
;;   spec: :my.domain/person

;; Fails attribute conformance
(s/explain ::person
  {::first-name "Bugs"
   ::last-name "Bunny"
   ::email "n/a"})
;; "n/a" - failed: (re-matches email-regex %) in: [:my.domain/email]
;;   at: [:my.domain/email] spec: :my.domain/email-type
```
Let’s take a moment to examine the explain error output on that final example:

- in - the path within the data to the failing value (here, a key in the person instance)
- val - the failing value, here `"n/a"`
- spec - the spec that failed, here `:my.domain/email-type`
- at - the path in the spec where the failing value is located
- predicate - the predicate that failed, here `(re-matches email-regex %)`

Much existing Clojure code does not use maps with namespaced keys and so keys can also specify `:req-un` and `:opt-un` for required and optional unqualified keys. These variants specify namespaced keys used to find their specification, but the map only checks for the unqualified version of the keys.

Let’s consider a person map that uses unqualified keys but checks conformance against the namespaced specs we registered earlier:
> 通过`s/def ::keyword predicate`定义`spec`，则会在当前命名空间解析该`spec`(之前提到过)，但是本身它是非命名空间限定的(unqualified namespace)；通过`s/def :namespace/keyword predicate`定义`spec`，则是命名空间限定的(qualified namespace)。


> 需要组合非限定命名空间(unqualified namespace)的`keyword`对应的`spec`，则使用`:req-run`, `:opt-run`； 需要组合限定命名空间(qualified namespace)的`keyword`对应的`spec`，则使用`:req`, `:opt`。当`confirm`出错时，查看对应的`keyword spec`的报错信息，你会发现二者的区别。如：
> ```clj
> ;; 非限定命名空间
> ;; "n/a" - failed: (re-matches email-regex %) in: [:email] at: [:email]
> ;;   spec: :my.domain/email-type
>
> ;; 限定命名空间 (my.domain)
> ;; "n/a" - failed: (re-matches email-regex %) in: [:my.domain/email]
> ;;   at: [:my.domain/email] spec: :my.domain/email-type
> ```

```clj
(s/def :unq/person
  (s/keys :req-un [::first-name ::last-name ::email]
          :opt-un [::phone]))

(s/conform :unq/person
  {::first-name "Bugs"
   ::last-name "Bunny"
   ::email "bugs@example.com"})
;;=> {:first-name "Bugs", :last-name "Bunny", :email "bugs@example.com"}



(s/explain :unq/person
  {:first-name "Bugs"
   :last-name "Bunny"
   :email "n/a"})
;; "n/a" - failed: (re-matches email-regex %) in: [:email] at: [:email]
;;   spec: :my.domain/email-type

(s/explain :unq/person
  {:first-name "Bugs"})
;; {:first-name "Bugs"} - failed: (contains? % :last-name) spec: :unq/person
;; {:first-name "Bugs"} - failed: (contains? % :email) spec: :unq/person
```

Unqualified keys can also be used to validate record attributes:
> 参考:
> - [https://clojure.org/reference/datatypes](https://clojure.org/reference/datatypes)
> - [http://clojuredocs.org/clojure.core/defrecord](http://clojuredocs.org/clojure.core/defrecord)
> - [http://cljs.github.io/api/cljs.core/defrecord](http://cljs.github.io/api/cljs.core/defrecord)
>
> 更多还需要详细阅读`deftype`, `defprotocol`等内容。

```clj
(defrecord Person [first-name last-name email phone])

(s/explain :unq/person
           (->Person "Bugs" nil nil nil))
;; nil - failed: string? in: [:last-name] at: [:last-name] spec: :my.domain/last-name
;; nil - failed: string? in: [:email] at: [:email] spec: :my.domain/email-type

(s/conform :unq/person
  (->Person "Bugs" "Bunny" "bugs@example.com" nil))
;;=> #my.domain.Person{:first-name "Bugs", :last-name "Bunny",
;;=>                   :email "bugs@example.com", :phone nil}
```

One common occurrence in Clojure is the use of "keyword args" where keyword keys and values are passed in a sequential data structure as options. Spec provides special support for this pattern with the regex op keys*. keys* has the same syntax and semantics as keys but can be embedded inside a sequential regex structure.
> 一个很通用的用法是使用`s/keys*`组合一些``keyword`对应的`spec` (简称`keyword spec`) 从而定义一个`spec`。使用时，可以通过`sequential`数据结构(`list`和`vector`)进行验证。

```clj
(s/def ::port number?)
(s/def ::host string?)
(s/def ::id keyword?)
(s/def ::server (s/keys* :req [::id ::host] :opt [::port]))
(s/conform ::server [::id :s1 ::host "example.com" ::port 5555])
;;=> {:my.domain/id :s1, :my.domain/host "example.com", :my.domain/port 5555}
```

Sometimes it will be convenient to declare entity maps in parts, either because there are different sources for requirements on an entity map or because there is a common set of keys and variant-specific parts. The `s/merge` spec can be used to combine multiple s/keys specs into a single spec that combines their requirements. For example consider two keys specs that define common animal attributes and some dog-specific ones. The dog entity itself can be described as a merge of those two attribute sets:
> `s/keys`只能组合单个`keyword`对应的`spec` (简称`keyword spec`)，而`s/merge`则可以组合多个`keyword`对应的`spec`。即`s/merge`可以组合通过`s/keys`形成的`spec`。

```clj
(s/def :animal/kind string?)
(s/def :animal/says string?)
(s/def :animal/common (s/keys :req [:animal/kind :animal/says]))
(s/def :dog/tail? boolean?)
(s/def :dog/breed string?)
(s/def :animal/dog (s/merge :animal/common
                            (s/keys :req [:dog/tail? :dog/breed])))
(s/valid? :animal/dog
  {:animal/kind "dog"
   :animal/says "woof"
   :dog/tail? true
   :dog/breed "retriever"})
;;=> true
```

## multi-spec

One common occurrence in Clojure is to use maps as tagged entities and a special field that indicates the "type" of the map where type indicates a potentially open set of types, often with shared attributes across the types.
> `s/keys`, `s/kes*`, `s/merge`从根本上来说，都是以`keyword`作为`entity`的属性。但是，`entity`除了共享属性外，也有属于自己的属性，标识自己的“与众不同”,通常使用`map`来标识，即它的类型字段("type" filed, which as `tag`)。这时，我们需要使用`multi-spec`。

As previously discussed, the attributes for all types are well-specified using attributes stored in the registry by namespaced keyword. Attributes shared across entity types automatically gain shared semantics. However, we also want to be able to specify the required keys per entity type and for that spec provides `multi-spec` which leverages a `multimethod` to provide for the specification of an open set of entity types based on a type tag.
> 实体类型是一组具有共同属性的实体的集合。
> 使用`multi-spec`和`multimethod`实现我们定义`map`作为实体类型`tag`的目标。

For example, imagine an API that received event objects which shared some common fields but also had type-specific shapes. First we would register the event attributes:
> 对于一个`envent`对象(实体)，它既有共享属性/字段（field）,也有属于自己的类型标识(即`tag`， 或`map attribute`)。注册其属性：

```clj
(s/def :event/type keyword?)
(s/def :event/timestamp int?)
(s/def :search/url string?)
(s/def :error/message string?)
(s/def :error/code int?)
```
We then need a `multimethod` that defines a dispatch function for choosing the selector (here our `:event/type` field) and returns the appropriate spec based on the value:

> - 使用`multimethod`定义选择器(这里是`:event/type`)的`dispatch`函数。
> - 即定义`confirm`一个 entity 的 "type" 相关属性时，应该由哪些`spec`处理。
> - 选择器是一个入口，并非 "type" 字段的一个属性
> - 不同的 "type" 表示不同的实体类型。如下面的 `search`和`error`则是不同的`event`实体，但却是属于相同的实体类型——`event`。或者，在数据库概念中，理解 "type" 为实体类型的主码，标示不同的实体。

```clj
(defmulti event-type :event/type)
(defmethod event-type :event/search [_]
  (s/keys :req [:event/type :event/timestamp :search/url]))
(defmethod event-type :event/error [_]
  (s/keys :req [:event/type :event/timestamp :error/message :error/code]))
```
The methods should ignore their argument and return the spec for the specified type. Here we’ve fully spec’ed two possible events - a "search" event and an "error" event.

And then finally we are ready to declare our multi-spec and try it out.
> 最终定义`multic-spec`如下:

```clj
(s/def :event/event (s/multi-spec event-type :event/type))

(s/valid? :event/event
  {:event/type :event/search
   :event/timestamp 1463970123000
   :search/url "https://clojure.org"})
;=> true
(s/valid? :event/event
  {:event/type :event/error
   :event/timestamp 1463970123000
   :error/message "Invalid host"
   :error/code 500})
;=> true
(s/explain :event/event
  {:event/type :event/restart})
;; #:event{:type :event/restart} - failed: no method at: [:event/restart]
;;   spec: :event/event
(s/explain :event/event
  {:event/type :event/search
   :search/url 200})
;; 200 - failed: string? in: [:search/url]
;;   at: [:event/search :search/url] spec: :search/url
;; {:event/type :event/search, :search/url 200} - failed: (contains? % :event/timestamp)
;;   at: [:event/search] spec: :event/event
```

Let’s take a moment to examine the explain error output on that final example. There were two different kinds of failures detected. The first failure is due to the missing required `:event/timestamp` key in the event. The second is from the invalid `:search/url` value (a number instead of a string). We see the same parts as prior explain errors:

- in - the path within the data to the failing value. This is omitted on the first error as it’s at the root value but is the key in the map on the second error.
- val - the failing value, either the full map or the individual key in the map
- spec - the actual spec that failed
- at - the path in the spec where the failing value occurred
- predicate - the actual predicate that failed

The `multi-spec` approach allows us to create an open system for spec validation, just like multimethods and protocols. New event types can be added later by just extending the event-type multimethod.
> 不太懂？

## Collections

A few helpers are provided for other special collection cases - [coll-of](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/coll-of), [tuple](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/tuple), and [map-of](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/map-of).

For the special case of a homogenous collection of arbitrary size, you can use coll-of to specify a collection of elements satisfying a predicate.
> 对于同类型的`coll`可以使用`s/coll-of`辅助判定。

```clj
(s/conform (s/coll-of keyword?) [:a :b :c])
;;=> [:a :b :c]
(s/conform (s/coll-of number?) #{5 10 2})
;;=> #{2 5 10}
```

Additionally, coll-of can be passed a number of keyword arg options:

- `:kind` - a predicate or spec that the incoming collection must satisfy, such as vector?
- `:count` - specifies exact expected count
  ```clj
  (s/conform (s/coll-of keyword? :distinct true) [:a :b :c :a])
  ;;:clojure.spec.alpha/invalid
  ```
- `:min-count`, `:max-count` - checks that collection has (<= min-count count max-count)
- `:distinct` - checks that all elements are distinct. `true` or `false`.
  ```clj
  (s/conform (s/coll-of keyword? :distinct true) [:a :b :c :a])
  ;; :clojure.spec.alpha/invalid
  ```
- `:into` - one of [], (), {}, or #{} for output conformed value. If `:into` is not specified, the input collection type will be used.

```clj
(s/def ::vnum3 (s/coll-of number? :kind vector? :count 3 :distinct true :into #{}))
(s/conform ::vnum3 [1 2 3])
;;=> #{1 2 3}
(s/explain ::vnum3 #{1 2 3})   ;; not a vector
;; #{1 3 2} - failed: vector? spec: :user/vnum3
(s/explain ::vnum3 [1 1 1])    ;; not distinct
;; [1 1 1] - failed: distinct? spec: :user/vnum3
(s/explain ::vnum3 [1 2 :a])   ;; not a number
;; :a - failed: number? in: [2] spec: :user/vnum3
```
---

	
Both `coll-of` and `map-of` will conform **all of their elements**, which may make them unsuitable for large collections. In that case, consider [`every`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/every) or for maps [`every-kv`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/every-kv).

---

While `coll-of` is good for homogenous collections of any size, another case is a fixed-size positional collection with fields of known type at different positions. For that we have `tuple`.
> `coll-of`对于同类型`entry`的`coll`很方便；`tuple`对于已知`entry`位置和类型的`coll`很方便。

```clj
(s/def ::point (s/tuple double? double? double?))
(s/conform ::point [1.5 2.5 -0.5])
;;=> [1.5 2.5 -0.5]

(s/def ::point (s/tuple double? double? string?))
(s/conform ::point [1.5 2.5 -0.5])
;;=> :clojure.spec.alpha/invalid
```
Note that in this case of a "point" structure with x/y/z values we actually had a choice of three possible specs:

- Regular expression - `(s/cat :x double? :y double? :z double?)`
  - Allows for matching nested structure (not needed here)
  - Conforms to map with named keys based on the `cat` tags
    ```clj
    (s/conform ::point [1.5 2.5 -0.5])
    ;; => {:x 1.5, :y 2.5, :z -0.5}
    (s/conform ::point {:x 1.5 :y 2.5 :z -0.5})
    ;; => :clojure.spec.alpha/invalid
    ```
- Collection - `(s/coll-of double?)`
  - Designed for arbitrary size homogenous collections
  - Conforms to a vector of the values
- Tuple - `(s/tuple double? double? double?)`
  - Designed for fixed size with known positional "fields"
  - Conforms to a vector of the values

> `conforms to`(相似，成一致)  代表验证为`valid`后输出的数据形式

In this example, coll-of will match other (invalid) values as well (like [1.0] or [1.0 2.0 3.0 4.0]), so it is not a suitable choice - we want fixed fields. The choice between a regular expression and tuple here is to some degree a matter of taste, possibly informed by whether you expect either the tagged return values or error output to be better with one or the other.

In addition to the support for information maps via `keys`, spec also provides map-of for maps with homogenous key and value predicates.
> `map-of`适用于`entry`类型相同的`map`.

```clj
(s/def ::scores (s/map-of string? int?))
(s/conform ::scores {"Sally" 1000, "Joe" 500})
;; => {"Sally" 1000, "Joe" 500}
```

By default `map-of` will validate but not conform keys because conformed keys might create key duplicates that would cause entries in the map to be overridden. If conformed keys are desired, pass the option :conform-keys true.
> ??????

You can also use the various count-related options on map-of that you have with coll-of.

## Sequences

Sometimes sequential data is used to encode additional structure (typically new syntax, often used in macros). spec provides the standard regular expression operators to describe the structure of a sequential data value:
> 没有用过？so....

- [cat](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/cat) - concatenation of predicates/patterns
- [alt](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/alt) - choice among alternative predicates/patterns
- [*](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/*) - 0 or more of a predicate/pattern
- [+](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/%2B) - 1 or more of a predicate/pattern

- [?](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/%3F) - 0 or 1 of a predicate/pattern

Like `or`, both `cat` and `alt` tag their "parts" - these tags are then used in the conformed value to identify what was matched, to report errors, and more.

Consider an ingredient represented by a vector containing a quantity (number) and a unit (keyword). The spec for this data uses `cat` to specify the right components in the right order. Like predicates, regex operators are implicitly converted to specs when passed to functions like `conform`, `valid?`, etc.
> `cat`前面已经提过，能够同时验证位置和类型。如下面的第一个位置必须为`number`。如同`predicate`一样，当传递给`conform`等验证函数时，`regx`(正则操作)也会被转换为`spec`。

```clj
(s/def ::ingredient (s/cat :quantity number? :unit keyword?))
(s/conform ::ingredient [2 :teaspoon])
;;=> {:quantity 2, :unit :teaspoon}
```
The data is conformed as a map with the tags as keys. We can use `explain` to examine non-conforming data.
> 使用后，验证的数据会被转换为`map`，以`spec`中的`tag`作为`key`。

```clj
;; pass string for unit instead of keyword
(s/explain ::ingredient [11 "peaches"])
;; "peaches" - failed: keyword? in: [1] at: [:unit] spec: :user/ingredient

;; leave out the unit
(s/explain ::ingredient [2])
;; () - failed: Insufficient input at: [:unit] spec: :user/ingredient
```
Let’s now see the various occurrence operators `*`, `+`, and `?`:

```clj
(s/def ::seq-of-keywords (s/* keyword?))
(s/conform ::seq-of-keywords [:a :b :c])
;;=> [:a :b :c]
(s/explain ::seq-of-keywords [10 20])
;; 10 - failed: keyword? in: [0] spec: :user/seq-of-keywords

(s/def ::odds-then-maybe-even (s/cat :odds (s/+ odd?)
                                     :even (s/? even?)))
(s/conform ::odds-then-maybe-even [1 3 5 100])
;;=> {:odds [1 3 5], :even 100}
(s/conform ::odds-then-maybe-even [1])
;;=> {:odds [1]}
(s/explain ::odds-then-maybe-even [100])
;; 100 - failed: odd? in: [0] at: [:odds] spec: :user/odds-then-maybe-even

;; opts are alternating keywords and booleans
(s/def ::opts (s/* (s/cat :opt keyword? :val boolean?)))
(s/conform ::opts [:silent? false :verbose true])
;;=> [{:opt :silent?, :val false} {:opt :verbose, :val true}]
```

Finally, we can use `alt` to specify alternatives within the sequential data. Like `cat`, `alt` requires you to tag each alternative but the conformed data is a vector of tag and value.
> 可选。 `val`可选为`string`或者`boolean`

```clj
(s/def ::config (s/*
                  (s/cat :prop string?
                         :val  (s/alt :s string? :b boolean?))))
(s/conform ::config ["-server" "foo" "-verbose" true "-user" "joe"])
;;=> [{:prop "-server", :val [:s "foo"]}
;;    {:prop "-verbose", :val [:b true]}
;;    {:prop "-user", :val [:s "joe"]}]
```

If you need a description of a specification, use `describe` to retrieve one. Let’s try it on some of the specifications we’ve already defined:
> `describe`描述你注册/定义的`spec`的内容。具体如下：

```clj
(s/describe ::seq-of-keywords)
;;=> (* keyword?)
(s/describe ::odds-then-maybe-even)
;;=> (cat :odds (+ odd?) :even (? even?))
(s/describe ::opts)
;;=> (* (cat :opt keyword? :val boolean?))
```

Spec also defines one additional regex operator, [&](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/&), which takes a regex operator and constrains it with one or more additional predicates. This can be used to create regular expressions with additional constraints that would otherwise require custom predicates. For example, consider wanting to match only sequences with an even number of strings:
> `&`接收 一个`regx`和多个`predicate`。将它们组合到一起，形成`spec`。

```clj
(s/def ::even-strings (s/& (s/* string?) #(even? (count %))))
(s/valid? ::even-strings ["a"])  ;; false
(s/valid? ::even-strings ["a" "b"])  ;; true
(s/valid? ::even-strings ["a" "b" "c"])  ;; false
(s/valid? ::even-strings ["a" "b" "c" "d"])  ;; true
```

When regex ops are combined, they describe a single sequence. If you need to spec a nested sequential collection, you must use an explicit call to [`spec`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/spec) to start a new nested regex context. For example to describe a sequence like [:names ["a" "b"] :nums [1 2 3]], you need nested regular expressions to describe the inner sequential data:
> 正常情况下`regx`操作不能用于嵌套的`seq coll`。可以显式使用`spec`去实现嵌套。

```clj

(s/def ::nested
  (s/cat :names-kw #{:names}
         :names (s/spec (s/* string?))
         :nums-kw #{:nums}
         :nums (s/spec (s/* number?))))
(s/conform ::nested [:names ["a" "b"] :nums [1 2 3]])
;;=> {:names-kw :names, :names ["a" "b"], :nums-kw :nums, :nums [1 2 3]}
```

If the specs were removed this spec would instead match a sequence like [:names "a" "b" :nums 1 2 3].

```clj
(s/def ::unnested
  (s/cat :names-kw #{:names}
         :names (s/* string?)
         :nums-kw #{:nums}
         :nums (s/* number?)))
(s/conform ::unnested [:names "a" "b" :nums 1 2 3])
;;=> {:names-kw :names, :names ["a" "b"], :nums-kw :nums, :nums [1 2 3]}
```

## Using spec for validation

Now is a good time to step back and think about how spec can be used for runtime data validation.

One way to use spec is to explicitly call `valid?` to verify input data passed to a function. You can, for example, use the existing **pre- and post-condition** support built into `defn`:
> 用法一： 验证函数参数和返回值是否正确。
>
> - 验证参数，`：pre`
> - 验证返回值， `:post`

```clj
(defn person-name
  [person]
  {:pre [(s/valid? ::person person)]
   :post [(s/valid? string? %)]}
  (str (::first-name person) " " (::last-name person)))

(person-name 42)
;;=> java.lang.AssertionError: Assert failed: (s/valid? :my.domain/person person)

(person-name {::first-name "Bugs" ::last-name "Bunny" ::email "bugs@example.com"})
;; Bugs Bunny
```

When the function is invoked with something that isn’t valid `::person` data, the pre-condition fails. Similarly, if there was a bug in our code and the output was not a string, the post-condition would fail.

Another option is to use `s/assert` within your code to assert that a value satisfies a spec. On success the value is returned and on failure an assertion error is thrown. By default assertion checking is off - this can be changed at the REPL with `s/check-asserts` or on startup by setting the system property `clojure.spec.check-asserts=true`.
> 用法二：
>
>- 使用`s/assert`验证一个值是否满足`spec`。需要设置`s/check-asserts`为`true`.
>

```clj
(defn person-name
  [person]
  (let [p (s/assert ::person person)]
    (str (::first-name p) " " (::last-name p))))

(s/check-asserts true)
(person-name 100)
;; Execution error - invalid arguments to my.domain/person-name at (REPL:3).
;; 100 - failed: map?
```

A deeper level of integration is to call `conform` and use the return value with destructuring to pull apart the input. This will be particularly useful for complex inputs with alternate options.

Here we conform using the config specification defined above:
> 用法三：
>
> - 复杂输入类型，使用`s/conform`，然后将其返回值解构，获取需要的参数
>
>```clj
>(s/def ::config (s/*
>                  (s/cat :prop string?
>                         :val  (s/alt :s string? :b boolean?))))
>```

```clj
(defn- set-config [prop val]
  ;; dummy fn
  (println "set" prop val))

(defn configure [input]
  (let [parsed (s/conform ::config input)]
    (if (= parsed ::s/invalid)
      (throw (ex-info "Invalid input" (s/explain-data ::config input)))
      (for [{prop :prop [_ val] :val} parsed]
        (set-config (subs prop 1) val)))))

(configure ["-server" "foo" "-verbose" true "-user" "joe"])
```

Here configure calls `conform` to produce data good for destructuring the config input. The result is either the special `::s/invalid` value or an annotated form of the result:
> 输出`form`更加友好

```clj
[{:prop "-server", :val [:s "foo"]}
 {:prop "-verbose", :val [:b true]}
 {:prop "-user", :val [:s "joe"]}]
```

In the success case, the parsed input is transformed into the desired shape for further processing. In the error case, we call `explain-data` to generate error message data. The explain data contains information about what expression failed to conform, the path to that expression in the specification, and the predicate it was attempting to match.

## Spec’ing functions

The pre- and post-condition example in the previous section hinted at an interesting question - how do we define the input and output specifications for a function or macro?

Spec has explicit support for this using [`fdef`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/fdef), which defines specifications for a function - the arguments and/or the return value spec, and optionally a function that can specify a relationship between args and return.

Let’s consider a `ranged-rand` function that produces a random number in a range:

```clj
(defn ranged-rand
  "Returns random int in range start <= rand < end"
  [start end]
  (+ start (long (rand (- end start)))))
```

We can then provide a specification for that function:

```clj
(s/fdef ranged-rand
  :args (s/and (s/cat :start int? :end int?)
               #(< (:start %) (:end %)))
  :ret int?
  :fn (s/and #(>= (:ret %) (-> % :args :start))
             #(< (:ret %) (-> % :args :end))))
```

This function spec demonstrates a number of features. First the `:args` is a compound spec that describes the **function arguments**. This spec is invoked with the args in a list, as if they were passed to `(apply fn (arg-list))`. Because the args are sequential and the args are positional fields, they are almost always described using a regex op, like `cat`, `alt`, or `*`.
> `:args` 定义参数的`spec`。由于参数传递有序，最好使用`regx op`.

The second `:args` predicate takes as input the conformed result of the first predicate and verifies that start < end. The `:ret` spec indicates the return is also an integer. Finally, the `:fn` spec checks that the return value is >= start and < end.
> `s/and` 后一个`spec`可以接收前一个的`spec`输出作为参数。<br/>
> `:ret` 定义返回值的`spec`<br/>
> `fn` 定义输入参数和返回值关系

Once a spec has been created for a function, the doc for the function will also include it:

```clj
(doc ranged-rand)
-------------------------
user/ranged-rand
([start end])
  Returns random int in range start <= rand < end
Spec
  args: (and (cat :start int? :end int?) (< (:start %) (:end %)))
  ret: int?
  fn: (and (>= (:ret %) (-> % :args :start)) (< (:ret %) (-> % :args :end)))
```
We’ll see later how we can use a function spec for development and testing.
> 用法请看：

## Higher order functions

Higher order functions are common in Clojure and spec provides [`fspec`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/fspec) to support spec’ing them.
> 支持高阶函数的`spec`。

For example, consider the adder function:

```clj
(defn adder [x] #(+ x %))
```

`adder` returns a function that adds x. We can declare a function spec for `adder` using `fspec` for the return value:

```clj
(s/fdef adder
  :args (s/cat :x number?)
  :ret (s/fspec :args (s/cat :y number?)
                :ret number?)
  :fn #(= (-> % :args :x) ((:ret %) 0)))
```

The `:ret` spec uses `fspec` to declare that the returning function takes and returns a number. Even more interesting, the `:fn` spec can state a general property that relates the `:arg`s (where we know x) and the result we get from invoking the function returned from `adder`, namely that adding 0 to it should return x.
> 和`s/spec`区别。`:fn`接受`:args`和`:ret`的结果作为参数。注意是`：ret`整体的值，而不是`:ret ... :ret`的返回值。

## Macros

As macros are functions that take code and produce code, they can also be spec’ed like functions. One special consideration however is that you must keep in mind that you are receiving code as data, not evaluated arguments, and that you are most commonly producing new code as data, so often it’s not helpful to spec the :ret value of a macro (as it’s just code).
> `macro`也可以像普通函数那样`spec`。但是记住一点，使用`:ret`的意义不大，因为`macro`是接收代码并生成代码的工具，每次接收不同的参数，产生不同的代码。`:ret`基本无用。

For example, we could spec the clojure.core/declare macro like this:

```clj
(s/fdef clojure.core/declare
    :args (s/cat :names (s/* simple-symbol?))
    :ret any?)
```

The Clojure macroexpander will look for and conform `:args` specs registered for macros at macro expansion time (not runtime!). If an error is detected, explain will be invoked to explain the error:
> `conform`发生在`macro`展开阶段。

```clj
(declare 100)
;; Syntax error macroexpanding clojure.core/declare at (REPL:1:1).
;; 100 - failed: simple-symbol? at: [:names]
```

Because macros are always checked during macro expansion, you do not need to call instrument for macro specs.

## A game of cards

Here’s a bigger set of specs to model a game of cards:
> 使用纸牌游戏建模，学习`spec`的使用。

```clj
(def suit? #{:club :diamond :heart :spade})
(def rank? (into #{:jack :queen :king :ace} (range 2 11)))
(def deck (for [suit suit? rank rank?] [rank suit]))

(s/def ::card (s/tuple rank? suit?))
(s/def ::hand (s/* ::card))

(s/def ::name string?)
(s/def ::score int?)
(s/def ::player (s/keys :req [::name ::score ::hand]))

(s/def ::players (s/* ::player))
(s/def ::deck (s/* ::card))
(s/def ::game (s/keys :req [::players ::deck]))
```

We can validate a piece of this data against the schema:

```clj
(def kenny
  {::name "Kenny Rogers"
   ::score 100
   ::hand []})
(s/valid? ::player kenny)
;;=> true
```

Or look at the errors we’ll get from some bad data:

```clj
(s/explain ::game
  {::deck deck
   ::players [{::name "Kenny Rogers"
               ::score 100
               ::hand [[2 :banana]]}]})
;; :banana - failed: suit? in: [:user/players 0 :user/hand 0 1]
;;   at: [:user/players :user/hand 1] spec: :user/card
```

The error indicates the key path in the data structure down to the invalid value, the non-matching value, the spec part it’s trying to match, the path in that spec, and the predicate that failed.
> error的信息
> - key path - `[:user/players :user/hand 1]`
> - non-matching value - `:banana`
> - the spec part it’s trying to match - `:user/card`
> - path in spec - `[:user/players 0 :user/hand 0 1]`
> - predicate - `suit?`

If we have a function `deal` that doles out some cards to the players we can spec that function to verify the arg and return value are both suitable data values. We can also specify a `:fn` spec to verify that the count of cards in the game before the deal equals the count of cards after the deal.
> 函数`deal`为玩家发牌。我们验证其输入参数和返回值是否都有效。

```clj
(defn total-cards [{:keys [::deck ::players] :as game}]
  (apply + (count deck)
    (map #(-> % ::hand count) players)))

(defn deal [game] .... )


(s/fdef deal
  :args (s/cat :game ::game)
  :ret ::game
  :fn #(= (total-cards (-> % :args :game))
          (total-cards (-> % :ret))))
```

## Generators

A key design constraint of spec is that all specs are also designed to act as generators of sample data that conforms to the spec (a critical requirement for property-based testing).
> 使用`spec`也可以生成被其`conform`验证为`valide`的值。

### Project Setup
> 配置

spec generators rely on the Clojure property testing library [test.check](https://github.com/clojure/test.check). However, this dependency is dynamically loaded and you can use the parts of spec other than gen, exercise, and testing without declaring `test.check` as a runtime dependency. When you wish to use these parts of spec (typically during testing), you will need to declare a dev dependency on `test.check`.
> `spec`生成器依赖于一个动态加载特性的库。即运行时加载。

In Leiningen add this to `project.clj`:

```clj
:profiles {:dev {:dependencies [[org.clojure/test.check "0.9.0"]]}}
```

In Leiningen the dev profile dependencies are included during testing but not published as a dependency or included in uber jars.

In Boot, add your dependency with test scope in your build.boot file (this is also possible in Leiningen but the approach above is preferred):

```clj
(set-env!
 :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]])
```

In Maven, declare your dependency as a test scope dependency:

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>org.clojure</groupId>
      <artifactId>test.check</artifactId>
      <version>0.9.0</version>
      <scope>test</scope>
    </dependency>
  </dependency>
</project>
```

In your code you also need to include the `clojure.spec.gen.alpha` namespace:

```clj
(require '[clojure.spec.gen.alpha :as gen])
```
> `clojure.spec.gen.alpha` 对`test.check`做了简单封装。

### Sampling Generators
> 补充：<br/>
> 纸牌花色<br/>
> spades (♠), hearts (♥), diamonds (♦) and clubs (♣)<br/>
> 一些名词
> - `card case` 牌盒 
> - `deck`  整付牌

The [gen](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/gen) function can be used to obtain the generator for any spec.

Once you have obtained a generator with `gen`, there are several ways to use it. You can generate a single sample value with [`generate`](https://clojure.github.io/spec.alpha/clojure.spec.gen.alpha-api.html#clojure.spec.gen.alpha/generate) or a series of samples with [`sample`](https://clojure.github.io/spec.alpha/clojure.spec.gen.alpha-api.html#clojure.spec.gen.alpha/sample). Let’s see some basic examples:
> 测试请在项目环境中打开`repl`。
> `generate`产生一个例子
> `sample`产生多个例子

```clj
(gen/generate (s/gen int?))
;;=> -959
(gen/generate (s/gen nil?))
;;=> nil
(gen/sample (s/gen string?))
;;=> ("" "" "" "" "8" "W" "" "G74SmCm" "K9sL9" "82vC")
(gen/sample (s/gen #{:club :diamond :heart :spade}))
;;=> (:heart :diamond :heart :heart :heart :diamond :spade :spade :spade :club)

(gen/sample (s/gen (s/cat :k keyword? :ns (s/+ number?))))
;;=> ((:D -2.0)
;;=>  (:q4/c 0.75 -1)
;;=>  (:*!3/? 0)
;;=>  (:+k_?.p*K.*o!d/*V -3)
;;=>  (:i -1 -1 0.5 -0.5 -4)
;;=>  (:?!/! 0.515625 -15 -8 0.5 0 0.75)
;;=>  (:vv_z2.A??!377.+z1*gR.D9+G.l9+.t9/L34p -1.4375 -29 0.75 -1.25)
;;=>  (:-.!pm8bS_+.Z2qB5cd.p.JI0?_2m.S8l.a_Xtu/+OM_34* -2.3125)
;;=>  (:Ci 6.0 -30 -3 1.0)
;;=>  (:s?cw*8.t+G.OS.xh_z2!.cF-b!PAQ_.E98H4_4lSo/?_m0T*7i 4.4375 -3.5 6.0 108 0.33203125 2 8 -0.517578125 -4))
```

What about generating a random player in our card game?

```clj
(gen/generate (s/gen ::player))
;;=> {:spec.examples.guide/name "sAt8r6t",
;;    :spec.examples.guide/score 233843,
;;    :spec.examples.guide/hand ([8 :spade] [5 :diamond] [9 :club] [3 :heart])}
```

What about generating a whole game?

```clj
(gen/generate (s/gen ::game))
;; it works! but the output is really long, so not including it here
```

So we can now start with a spec, extract a generator, and generate some data. All generated data will conform to the spec we used as a generator. For specs that have a conformed value different than the original value (anything using `s/or`, `s/cat`, `s/alt`, etc) it can be useful to see a set of generated samples plus the result of conforming that sample data.
> 自动生成样本，可以参考样本修改`spec`或者修改定义的`value`.

### Exercise

For this we have [`exercise`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/exercise), which returns pairs of generated and conformed values for a spec. exercise by default produces 10 samples (like sample) but you can pass both functions a number indicating the number of samples to produce.
> `exercise`生成例子，包含`value`和`conform`后的结果。默认生成10组，可控。

```clj
(s/exercise (s/cat :k keyword? :ns (s/+ number?)) 5)
;;=>
;;([(:y -2.0) {:k :y, :ns [-2.0]}]
;; [(:_/? -1.0 0.5) {:k :_/?, :ns [-1.0 0.5]}]
;; [(:-B 0 3.0) {:k :-B, :ns [0 3.0]}]
;; [(:-!.gD*/W+ -3 3.0 3.75) {:k :-!.gD*/W+, :ns [-3 3.0 3.75]}]
;; [(:_Y*+._?q-H/-3* 0 1.25 1.5) {:k :_Y*+._?q-H/-3*, :ns [0 1.25 1.5]}])

(s/exercise (s/or :k keyword? :s string? :n number?) 5)
;;=> ([:H [:k :H]]
;;    [:ka [:k :ka]]
;;    [-1 [:n -1]]
;;    ["" [:s ""]]
;;    [-3.0 [:n -3.0]])
```

For spec’ed functions we also have [`exercise-fn`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/exercise), which generates sample args, invokes the spec’ed function and returns the args and the return value.
> `exercise-fn`作用于函数，返回一组数据。其中包含`fn`的输入参数和返回值。

```clj
(s/exercise-fn `ranged-rand)
; =>
;([(-2 -1)   -2]
; [(-3 3)     0]
; [(0 1)      0]
; [(-8 -7)   -8]
; [(3 13)     7]
; [(-1 0)    -1]
; [(-69 99) -41]
; [(-19 -1)  -5]
; [(-1 1)    -1]
; [(0 65)     7])
```

### Using `s/and` Generators

All of the generators we’ve seen worked fine but there are a number of cases where they will need some additional help. One common case is when the predicate implicitly presumes values of a particular type but the spec does not specify them:
> 并非所有的`predicate`都可以使用`generators`生成样例。例如：

```clj
(gen/generate (s/gen even?))
;; Execution error (ExceptionInfo) at user/eval1281 (REPL:1).
;; Unable to construct gen at: [] for: clojure.core$even_QMARK_@73ab3aac
```

In this case spec was not able to find a generator for the even? predicate. Most of the primitive generators in spec are mapped to the common type predicates (strings, numbers, keywords, etc).
> 大部分的原生`generator`都会映射为一些公共的`predicate`。但是有些`predicate`没有对应的`genenrator`.

However, spec is designed to support this case via and - the first predicate will determine the generator and subsequent branches will act as filters by applying the predicate to the produced values (using test.check’s `such-that`).
> 可以通过另一种方式实现--`s/and`。其第一个参数会决定`generator`的类型，后续的参数作为`fliter`.

If we modify our predicate to use an and and a predicate with a mapped generator, the even? can be used as a filter for generated values instead:

```clj
(gen/generate (s/gen (s/and int? even?)))
;;=> -15161796
```

We can use many predicates to further refine the generated values. For example, say we only wanted to generate numbers that were positive multiples of 3:
> 可以使用多个`predicate`去更进一步明确生成的样例。

```clj
(defn divisible-by [n] #(zero? (mod % n)))

(gen/sample (s/gen (s/and int?
                     #(> % 0)
                     (divisible-by 3))))
;;=> (3 9 1524 3 1836 6 3 3 927 15027)
```

However, it is possible to go too far with refinement and make something that fails to produce any values. The test.check [such-that](https://clojure.github.io/test.check/clojure.test.check.generators.html#var-such-that) that implements the refinement will throw an error if the refinement predicate cannot be resolved within a relatively small number of attempts. For example, consider trying to generate strings that happen to contain the word "hello":
> 当然，在`refine` `value`的过程中，可能会出错。`such-that`提供了在一定次数之后无法获取所需结果，从而报错的功能。

```clj
;; hello, are you the one I'm looking for?
(gen/sample (s/gen (s/and string? #(clojure.string/includes? % "hello"))))
;; Error printing return value (ExceptionInfo) at clojure.test.check.generators/such-that-helper (generators.cljc:320).
;; Couldn't satisfy such-that predicate after 100 tries.
```

Given enough time (maybe a lot of time), the generator probably would come up with a string like this, but the underlying such-that will make only 100 attempts to generate a value that passes the filter. This is a case where you will need to step in and provide a custom generator.
> 尝试100次后报错。使用自定义`generator`，解锁更多`such-that`的使用方法。

### Custom Generators

Building your own generator gives you the freedom to be either narrower and/or be more explicit about what values you want to generate. Alternately, custom generators can be used in cases where conformant values can be generated more efficiently than using a base predicate plus filtering. Spec does not trust custom generators and any values they produce will also be checked by their associated spec to guarantee they pass conformance.
> 自定义`generator`
> - 更精确获取所需`value`
> - 改进`predicate` + `filter`的使用某些`spec`去生成样例的方式
> - `Spec`并不信任自定的`generator`，会自动再次做验证

There are three ways to build up custom generators - in decreasing order of preference:
> 方法：推荐值递减

- Let spec create a generator based on a predicate/spec
- Create your own generator from the tools in clojure.spec.gen.alpha
- Use test.check or other test.check compatible libraries (like [test.chuck](https://github.com/gfredericks/test.chuck))

---

The last option requires a runtime dependency on test.check so the first two options are strongly preferred over using test.check directly.
> 第三种存在`run-time`依赖问题。
---

First consider a spec with a predicate to specify keywords from a particular namespace:

```clj
(s/def ::kws (s/and keyword? #(= (namespace %) "my.domain")))
(s/valid? ::kws :my.domain/name) ;; true
(gen/sample (s/gen ::kws)) ;; unlikely we'll generate useful keywords this way
```
> 简单但无效

The simplest way to start generating values for this spec is to have spec create a generator from a fixed set of options. A set is a valid predicate spec so we can create one and ask for it’s generator:
> 让其变有效的方式：
```clj
(def kw-gen (s/gen #{:my.domain/name :my.domain/occupation :my.domain/id}))
(gen/sample kw-gen 5)
;;=> (:my.domain/occupation :my.domain/occupation :my.domain/name :my.domain/id :my.domain/name)
```

To redefine our spec using this custom generator, use [`with-gen`](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/with-gen) which takes a spec and a replacement generator:

```clj
(s/def ::kws (s/with-gen (s/and keyword? #(= (namespace %) "my.domain"))
               #(s/gen #{:my.domain/name :my.domain/occupation :my.domain/id})))
(s/valid? ::kws :my.domain/name)  ;; true
(gen/sample (s/gen ::kws))
;;=> (:my.domain/occupation :my.domain/occupation :my.domain/name  ...)
```

Note that `with-gen` (and other places that take a custom generator) take a no-arg function that returns the generator, allowing it to be lazily realized.

One downside to this approach is we are missing what property testing is really good at: automatically generating data across a wide search space to find unexpected problems.

The clojure.spec.gen.alpha namespace has a number of functions for generator "primitives" as well as "combinators" for combining them into more complicated generators.

---

Nearly all of the functions in the `clojure.spec.gen.alpha` namespace are merely wrappers that dynamically load functions of the same name in `test.check`. You should refer to the documentation for `test.check` for more details on how all of the `clojure.spec.gen.alpha` generator functions work.
> `clojure.spec.gen.alpha`仅仅是对`test.check`内的函数进行了封装，而且其名称也相同。查看具体用法细节，到`test.check`相关文档。
---

In this case we want our keyword to have open names but fixed namespaces. There are many ways to accomplish this but one of the simplest is to use [`fmap`](https://clojure.github.io/spec.alpha/clojure.spec.gen.alpha-api.html#clojure.spec.gen.alpha/fmap) to build up a keyword based on generated strings:
> 使用`fmap`构建`keyword`字符串。

```clj
(def kw-gen-2 (gen/fmap #(keyword "my.domain" %) (gen/string-alphanumeric)))
(gen/sample kw-gen-2 5)
;;=> (:my.domain/ :my.domain/ :my.domain/1 :my.domain/1O :my.domain/l9p2)
```

`gen/fmap` takes a function to apply and a generator. The function will be applied to each sample produced by the generator allowing us to build one generator on another.

However, we can spot a problem in the example above - generators are often designed to return "simpler" values first and any string-oriented generator will often return an empty string which is not a valid keyword. We can make a slight adjustment to omit that particular value using such-that which lets us specify a filtering condition:
> 使用`gen/such-that`做过滤改进。

```clj
(def kw-gen-3 (gen/fmap #(keyword "my.domain" %)
               (gen/such-that #(not= % "")
                 (gen/string-alphanumeric))))
(gen/sample kw-gen-3 5)
;;=> (:my.domain/O :my.domain/b :my.domain/ZH :my.domain/31 :my.domain/U)
```

Returning to our "hello" example, we now have the tools to make that generator:
> 实现最初的`::hello`

```clj
(s/def ::hello
  (s/with-gen #(clojure.string/includes? % "hello")
    #(gen/fmap (fn [[s1 s2]] (str s1 "hello" s2))
      (gen/tuple (gen/string-alphanumeric) (gen/string-alphanumeric)))))
(gen/sample (s/gen ::hello))
;;=> ("hello" "ehello3" "eShelloO1" "vhello31p" "hello" "1Xhellow" "S5bhello" "aRejhellorAJ7Yj" "3hellowPMDOgv7" "UhelloIx9E")
```

Here we generate a tuple of a random prefix and random suffix strings, then insert "hello" between them.

### Range Specs and Generators

There are several cases where it’s useful to spec (and generate) values in a range and spec provides helpers for these cases.

> `int-in`的用法：[https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/inst-in](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/inst-in)

For example, in the case of a range of integer values (for example, a bowling roll), use `int-in` to spec a range (end is exclusive):
```clj
(s/def ::roll (s/int-in 0 11))
(gen/sample (s/gen ::roll))
;;=> (1 0 0 3 1 7 10 1 5 0)
```
spec also includes `inst-in` for a range of instants:

```clj
(s/def ::the-aughts (s/inst-in #inst "2000" #inst "2010"))
(drop 50 (gen/sample (s/gen ::the-aughts) 55))
;;=> (#inst"2005-03-03T08:40:05.393-00:00"
;;    #inst"2008-06-13T01:56:02.424-00:00"
;;    #inst"2000-01-01T00:00:00.610-00:00"
;;    #inst"2006-09-13T09:44:40.245-00:00"
;;    #inst"2000-01-02T10:18:42.219-00:00")
```

Due to the generator implementation, it takes a few samples to get "interesting" so I skipped ahead a bit.

> `double-in`的用法: [https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/double-in](https://clojure.github.io/spec.alpha/clojure.spec.alpha-api.html#clojure.spec.alpha/double-in)

Finally, double-in has support for double ranges and special options for checking special double values like `NaN` (not a number), `Infinity`, and `-Infinity`.

```clj
(s/def ::dubs (s/double-in :min -100.0 :max 100.0 :NaN? false :infinite? false))
(s/valid? ::dubs 2.9)
;;=> true
(s/valid? ::dubs Double/POSITIVE_INFINITY)
;;=> false
(gen/sample (s/gen ::dubs))
;;=> (-1.0 -1.0 -1.5 1.25 -0.5 -1.0 -3.125 -1.5625 1.25 -0.390625)
```

To learn more about generators, read the test.check tutorial or examples. Do keep in mind that while clojure.spec.gen.alpha is a large subset of clojure.test.check.generators, not everything is included.
> 注意: `clojure.spec.gen.alpha`是`clojure.test.check.generators`的一个子集，并不包括它的所有内容。

## Instrumentation and Testing

spec provides a set of development and testing functionality in the `clojure.spec.test.alpha` namespace, which we can include with:

```clj
(require '[clojure.spec.test.alpha :as stest])
```

### Instrumentation

Instrumentation validates that the `:args` spec is being invoked on instrumented functions and thus provides validation for external uses of a function. Let’s turn on instrumentation for our previously spec’ed ranged-rand function:
> Instrumentation 验证 参数是否满足`:arg` 定义的`spec`。

```clj
(stest/instrument `ranged-rand)
```

Instrument takes a fully-qualified symbol so we use **`** here to resolve it in the context of the current namespace. If the function is invoked with args that do not conform with the :args spec you will see an error like this:
> 不满足，报错。注意`stest/instrument`的参数，使用 **\`** 解析上下文，即获取其 具有`命名空间限定的`名称。

```clj
(ranged-rand 8 5)
Execution error - invalid arguments to user/ranged-rand at (REPL:1).
{:start 8, :end 5} - failed: (< (:start %) (:end %))
```
The error fails in the second args predicate that checks (`<` start end). Note that the `:ret` and `:fn` specs are not checked with instrumentation as validating the implementation should occur at testing time.
> `:ret` 和 `：fn` 并不在这里做检查验证。

Instrumentation can be turned off using the complementary function `unstrument`. Instrumentation is likely to be useful at both development time and during testing to discover errors in calling code. It is not recommended to use instrumentation in production due to the overhead involved with checking args specs.
> 也可以关闭 Instrumentation。为什么关闭？ 鉴于其检查`:args spec`的开销，不推荐在生产环境中使用`instrument`。

### Testing

We mentioned earlier that `clojure.spec.test.alpha` provides tools for automatically testing functions. When functions have specs, we can use [`check`](https://clojure.github.io/spec.alpha/clojure.spec.test.alpha-api.html#clojure.spec.test.alpha/check), to automatically generate tests that check the function using the specs.
> 使用`check`自动生成样例来测试`spec`.

`check` will generate arguments based on the `:args` spec for a function, invoke the function, and check that the `:ret` and `:fn` specs were satisfied.
> `check`会基于`:args` spec 生成参数，调用函数，从而检查`:ret`和`:fn` specs 是否为参数所满足。

```clj
(require '[clojure.spec.test.alpha :as stest])

(stest/check `ranged-rand)
;;=> ({:spec #object[clojure.spec.alpha$fspec_impl$reify__13728 ...],
;;     :clojure.spec.test.check/ret {:result true, :num-tests 1000, :seed 1466805740290},
;;     :sym spec.examples.guide/ranged-rand,
;;     :result true})
```
---

A keen observer will notice that `ranged-rand` contains a subtle bug. If the difference between start and end is very large (larger than is representable by `Long/MAX_VALUE`), then ranged-rand will produce an `IntegerOverflowException`. If you run `check` several times you will eventually cause this case to occur.
> `ranged-rand`的`start`和`end`差值过大，会溢出错误。`check`同样可以检查出来。

---

`check` also takes a number of options that can be passed to test.check to influence the test run, as well as the option to override generators for parts of the spec, by either name or path.
> `check`也接收一些可选参数，传递给`test.check`，影响其运行结果，就好像重写了部分`spec`的`generator`。

Imagine instead that we made an error in the `ranged-rand` code and swapped start and end:

```clj
(defn ranged-rand  ;; BROKEN!
  "Returns random int in range start <= rand < end"
  [start end]
  (+ start (long (rand (- start end)))))
```

This broken function will still create random integers, just not in the expected range. Our `:fn` spec will detect the problem when checking the var:

```clj
(stest/abbrev-result (first (stest/check `ranged-rand)))
;;=> {:spec (fspec
;;            :args (and (cat :start int? :end int?) (fn* [p1__3468#] (< (:start p1__3468#) (:end p1__3468#))))
;;            :ret int?
;;            :fn (and
;;                  (fn* [p1__3469#] (>= (:ret p1__3469#) (-> p1__3469# :args :start)))
;;                  (fn* [p1__3470#] (< (:ret p1__3470#) (-> p1__3470# :args :end))))),
;;     :sym spec.examples.guide/ranged-rand,
;;     :result {:clojure.spec.alpha/problems [{:path [:fn],
;;                                             :pred (>= (:ret %) (-> % :args :start)),
;;                                             :val {:args {:start -3, :end 0}, :ret -5},
;;                                             :via [],
;;                                             :in []}],
;;              :clojure.spec.test.alpha/args (-3 0),
;;              :clojure.spec.test.alpha/val {:args {:start -3, :end 0}, :ret -5},
;;              :clojure.spec.alpha/failure :test-failed}}
```
`check` has reported an error in the `:fn` spec. We can see the arguments passed were -3 and 0 and the return value was -5, which is out of the expected range.

To test all of the spec’ed functions in a namespace (or multiple namespaces), use [enumerate-namespace](https://clojure.github.io/spec.alpha/clojure.spec.test.alpha-api.html#clojure.spec.test.alpha/enumerate-namespace) to generate the set of symbols naming vars in the namespace:

```clj
;; example only for user namespace
(-> (stest/enumerate-namespace 'user) stest/check)
```
And you can check all of the spec’ed functions by calling stest/check without any arguments.

### Combining check and instrument

While both `instrument` (for enabling `:args` checking) and `check` (for generating tests of a function) are useful tools, they can be combined to provide even deeper levels of test coverage.

`instrument` takes a number of options for changing the behavior of instrumented functions, including support for swapping in alternate (narrower) specs, stubbing functions (by using the `:ret` spec to generate results), or replacing functions with an alternate implementation.
> `instrument`的用法

Consider the case where we have a low-level function that invokes a remote service and a higher-level function that calls it.

```clj
;; code under test

(defn invoke-service [service request]
  ;; invokes remote service
  )

(defn run-query [service query]
  (let [{::keys [result error]} (invoke-service service {::query query})]
    (or result error)))
```

We can spec these functions using the following specs:

```clj
(s/def ::query string?)
(s/def ::request (s/keys :req [::query]))
(s/def ::result (s/coll-of string? :gen-max 3))
(s/def ::error int?)
(s/def ::response (s/or :ok (s/keys :req [::result])
                    :err (s/keys :req [::error])))

(s/fdef invoke-service
  :args (s/cat :service any? :request ::request)
  :ret ::response)

(s/fdef run-query
  :args (s/cat :service any? :query string?)
  :ret (s/or :ok ::result :err ::error))
```

And then we want to test the behavior of run-query while stubbing out invoke-service with instrument so that the remote service is not invoked:

```clj
(stest/instrument `invoke-service {:stub #{`invoke-service}})
;;=> [spec.examples.guide/invoke-service]
(invoke-service nil {::query "test"})
;;=> #:spec.examples.guide{:error -11}
(invoke-service nil {::query "test"})
;;=> #:spec.examples.guide{:result ["kq0H4yv08pLl4QkVH8" "in6gH64gI0ARefv3k9Z5Fi23720gc"]}
(stest/summarize-results (stest/check `run-query))
;;=> {:total 1, :check-passed 1}
```

The first call here instruments and stubs invoke-service. The second and third calls demonstrate that calls to invoke-service now return generated results (rather than hitting a service). Finally, we can use check on the higher level function to test that it behaves properly based on the generated stub results returned from invoke-service.
> 通过`：stub`使得我们可以使用替代函数。使用方法是，使用`s/fdef`定义的`sym-fn`，首先检查`args`中的`spec`，然后利用`ret`中的`spec`自动生成返回值。例如上面，替代了`invoke-service`函数。
>
> `stest/summarize-results` 简化测试结果。
