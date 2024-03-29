# Coeffects

This tutorial explains `coeffects`.

It explains what they are, how they can be "injected", and how
to manage them in tests.

## What Are They?

Event handlers compute how the world should change in response to an event and, to do that, 
they need to first know the current state of the world. 

`coeffects` is the current state of the world, as data, as presented to an event handler.

Many event handlers only need applicaton state to do their job - that's as much of "the world"
as they need to know about. To make this common case easy to program, 
there's a specific registration function, called `reg-event-db`,
which delivers ONLY the coeffect `db` to the event handler  (and `event` of course). 

Such an event handler will have this signature:
```clj
(fn [db event] 
   ... return updated db)
```

But event handlers sometimes need to know more about the world OR have more inputs 
than just application state. Sometimes they need "inputs" like a random number, or a GUID,
or the current datetime. Perhaps they need access to LocalStore, or Cookies, or a
DataScript connection.

We refer to these inputs collectively as the event handler's `coeffects`.  When more than
application state is needed, we use the registration function `reg-event-fx` and the event handler has
a signature like this:
```clj
(fn [coeffects event]     ;; first arg is often abreviated to cofx 
    ... return a map of effects)
```

Notice how previously the first arg was `db` and now it is `coeffects`.  `coeffects` is a map, and it contains a 
`:db` key which is the current application state. But it can contain other keys holding data about other aspects of 
the world. So `coeffects` is a superset of `db`. It is a bigger world to compute against. 
 
##  A Motivating Example

Imagine you had an event handler which needed to "know" a value in LocalStore, in order to
compute an event's effect. 

It could be writen to access data directly from LocalStore:
```clj
(reg-event-db
   :load-defaults
   (fn [db _]
     (let [val (js->clj (.getItem js/localStorage "defaults-key"))]  ;; <-- Problem
       (assoc db :defaults val))))
```

This works, but there's a cost.

Because it has directly accessed LocalStore, this event handler is not
pure, and impure functions cause well-documented paper cuts, and paper cuts
have a way of accumulating non-linearly.

## How We Want It

Our goal in this tutorial is to rewrite this event handler so
that it __only__ uses data from arguments (coeffects!). This will take a few steps.

The first is that we switch to
using `reg-event-fx` (instead of `reg-event-db`).

Event handlers registered via `reg-event-fx` are slightly
different to those registered via `reg-event-db`. `-fx` handlers
get two arguments, but the first is not `db`. Instead it
is an argument which we will call `cofx` (that's a nice distinct
name which will aid communication).

Previous tutorials showed there's a `:db` key in `cofx`.  We
now want `cofx` to have other keys and values, like this:
```clj
(reg-event-fx                     ;; note: -fx
   :load-defaults
   (fn [cofx event]                 ;; cofx means coeffects
     (let [val (:local-store cofx)  ;; <-- get data from cofx
           db  (:db cofx)]          ;; <-- more data from cofx
       {:db (assoc db :defaults val)}))) ;; returns an effect
```

Notice how `cofx` magically contains a `:local-store` key with the
right value. Nice! But how do we make this magic happen?

## Abracadabra

Each time an event is "handled", a brand new `context` (map)
is created, and within that `context` is a `:coeffects` key which
is a further map (initially empty).

That pristine `context` value (containing, in turn, a pristine `:coeffects` map) is threaded
through the `:before` function of each interceptor (in the event handler chain) 
before it finally reaches the registered event handler, which sits on the end of the chain, 
itself wrapped up in an interceptor. We know this story well from a previous tutorial.

These `:before` functions have the  
opportunity to `assoc` into the `:coeffects` map (within the `context`), cumulatively adding to what it holds.  
Later, our event handler, which sits on the end of the chain, finds that its first 
 `cofx` argument contains just the right data, like, for example, a value for the key `:local-store`. 
So, it is the event handler's Interceptor chain which can add to the "world" eventually 
"seen" by an event handler. 
>## 杂谈
> 每当一个`event`被处理，就会创建一个新的`context`，其包括键值为`:coeffects`的`map`,该`map`初始化为空。<br/>
> 这个初始的`context`穿过层层拦截器的`：before`函数，最终到达位于拦截器链末端的已注册的`event handler`。它本身也是一个拦截器。<br/>
> 链中的每个拦截器的`before`函数都可以添加其拥有的数据到`：coeffects`，这些内容最终都可以被`event handler`看到。
> 
## Which Interceptors?

If Interceptors put data in `:coeffects`, then we'll need to add the right ones
when we register our event handler.

Something like this (this handler is the same as before, except for one detail):
```clj
(reg-event-fx
   :load-defaults
   [ (inject-cofx :local-store "defaults-key") ]     ;; <-- this is new
   (fn [cofx event]
     (let [val (:local-store cofx)
           db  (:db cofx)]
       {:db (assoc db :defaults val)})))
```
> 参考：[https://github.com/Day8/re-frame/blob/master/src/re_frame/core.cljc#L92](https://github.com/Day8/re-frame/blob/master/src/re_frame/core.cljc#L92)


Look at that - my event handler now has a new Interceptor which will inject (assoc) the
right key/value pair (`:local-store`)
into `context's` `:coeffects`, which itself is the map which goes on to be the first argument
to our event handler (aka `cofx`).
> `coeffects`又称为`cofx`


## `inject-cofx`

`inject-cofx` is part of the re-frame API.

It is a function which returns an Interceptor whose `:before` function loads
a key/value pair into a `context's` `:coeffects` map.

`inject-cofx` takes either one or two arguments. The first is always the `id` of the coeffect
required (called a `cofx-id`). The 2nd is an optional additional value.

So, in the case above, the `cofx-id` was `:local-store`  and the additional value
was "defaults-key" which was presumably the LocalStore key.

## More `inject-cofx`

Here's some other usage examples:

  -  `(inject-cofx :random-int 10)`
  -  `(inject-cofx :guid)`
  -  `(inject-cofx :now)`

I could create an event handler which has access to 3 coeffects:
```clj
(reg-event-fx
    :some-id
    [(inject-cofx :random-int 10) (inject-cofx :now)  (inject-cofx :local-store "blah")]  ;; 3
    (fn [cofx _]
       ... in here I can access cofx's keys :now :local-store and :random-int))
```

But that's probably just greedy. 

And so, to the final piece in the puzzle: how does `inject-cofx`
know what to do when it is given `:now` or `:local-store`?
Each `cofx-id` requires a different action.

## Meet `reg-cofx`

This function is also part of the re-frame API.

It allows you to associate a `cofx-id` (like `:now` or `:local-store`) with a
handler function that injects the right key/value pair.

The function you register will be passed two arguments:
  - a `:coeffects` map (to which it should add a key/value pair), and
  - optionally, the additional value supplied to `inject-cofx`

and it is expected to return a modified `:coeffects` map.

## Example Of `reg-cofx`

Above, we wrote an event handler that wanted `:now` data to be available.  Here
is how a handler could be registered for `:now`:
```clj
(reg-cofx               ;; registration function
   :now                 ;; what cofx-id are we registering
   (fn [coeffects _]    ;; second parameter not used in this case
      (assoc coeffects :now (js.Date.))))   ;; add :now key, with value
```

The outcome is:
  1. because that cofx handler above is now registered for `:now`, I can
  2. add an Interceptor to an event handler which
  3. looks like `(inject-cofx :now)`
  4. which means within that event handler I can access a `:now` value from `cofx`

As a result, my event handler is pure.
> `event handler`为纯函数，其他不一定是，如拦截器的`：before`函数。即上面我们所定义的函数。

## Another Example Of `reg-cofx`

This:
```clj
(reg-cofx               ;; new registration function
   :local-store
   (fn [coeffects local-store-key]
      (assoc coeffects
             :local-store
             (js->clj (.getItem js/localStorage local-store-key)))))
```


With these two registrations in place, I could now use both `(inject-cofx :now)` and
`(inject-cofx :local-store "blah")` in an event handler's interceptor chain.

To put this another way:  I can't use `(inject-cofx :blah)` UNLESS I have previously
used `reg-cofx` to register a handler for `:blah`. Otherwise `inject-cofx` doesn't
know how to inject a `:blah`.

## Secret Interceptors

In a previous tutorial we learned that `reg-events-db`
and `reg-events-fx` add default interceptors to the front of the interceptor chain
specified during registration. We found they inserted an Interceptor called `do-fx`.

I can now reveal that
they also add `(inject-cofx :db)` at the front of each chain.

Guess what that injects into the `:coeffects` of every event handler? This is how `:db`
is always available to event handlers.

Okay, so that was the last surprise. Now you know everything.

If ever you wanted to use DataScript, instead of an atom-containing-a-map
like `app-db`, you'd replace `reg-event-db` and `reg-event-fx` with your own
registration functions and have them auto insert the DataScript connection.

> 每个拦截器链都自动插入了两个拦截器：`do-fx`和`(inject-cofx :db)`,从而使得`event handler`都可以正常运行。

## Testing

During testing, you may want to stub out certain coeffects.

You may, for example, want to test that an event handler works
using a specific `now`.

In your test, you'd mock out the cofx handler:
```clj
(reg-cofx
   :now
   (fn [coeffects _]
      (assoc coeffects :now (js/Date. 2016 1 1)))   ;; then is `:now`
```

If your test does alter registered coeffect handlers, and you are using `cljs.test`,
then you can use a `fixture` to restore all coeffects at the end of your test:
```clj
(defn fixture-re-frame
  []
  (let [restore-re-frame (atom nil)]
    {:before #(reset! restore-re-frame (re-frame.core/make-restore-fn))
     :after  #(@restore-re-frame)}))

(use-fixtures :each (fixture-re-frame))
```

`re-frame.core/make-restore-fn` creates a checkpoint for re-frame state (including
registered handlers) to which you can return.

## The 5 Point Summary

In note form:

  1. Event handlers should only source data from their arguments
  2. We want to "inject" required data into the first, cofx argument
  3. We use the `(inject-cofx :key)` interceptor in registration of the event handler
  4. It will look up the registered cofx handler for that `:key` to do the injection
  5. We must have previously registered a cofx handler via `reg-cofx`


***

Previous:  [Effects](Effects.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:  [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:  [Infographic](SubscriptionInfographic.md)



<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- ## Table Of Contents -->

<!-- - [What Are They?](#what-are-they) -->
<!-- - [An Example](#an-example) -->
<!-- - [How We Want It](#how-we-want-it) -->
<!-- - [Abracadabra](#abracadabra) -->
<!-- - [Which Interceptors?](#which-interceptors) -->
<!-- - [`inject-cofx`](#inject-cofx) -->
<!-- - [More `inject-cofx`](#more-inject-cofx) -->
<!-- - [Meet `reg-cofx`](#meet-reg-cofx) -->
<!-- - [Example Of `reg-cofx`](#example-of-reg-cofx) -->
<!-- - [Another Example Of `reg-cofx`](#another-example-of-reg-cofx) -->
<!-- - [Secret Interceptors](#secret-interceptors) -->
<!-- - [Testing](#testing) -->
<!-- - [The 5 Point Summary](#the-5-point-summary) -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
1