---
title: Javascript Promise 的用法
subtitle: The Usage Of Javascript Promise
date: 2016-07-29 13:06:45
updated: 2016-07-29 13:06:45
categories:
 - Javascript
tags:
 - Promise
---

回调是 JavaScript 编程中比较令人纠结的写法，主要是用于处理“并列”或者“并行”的操作，然后在回调函数中处理操作结果。这样原生的回调写法就会带来以下的不便。

1. 回调结果状态不便管理
2. 回调方式自由松散，没有规范约束

Promise 对象是 JavaScript 的异步操作解决方案，为异步操作提供统一接口。它起到代理作用，充当异步操作与回调函数之间的中介，使得异步操作具备同步操作的接口。Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

{% codeblock lang:'javascript' line_number:'true' %}
// 传统写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // ...
      });
    });
  });
});

// Promise 的写法
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
{% endcodeblock %}
<!--more-->

## 1. 基本用法
Promise 对象是一个构造函数，用来生成 Promise 实例。
下面代码创造了一个 Promise 实例。
{% codeblock lang:'javascript' line_number:'true' %}
const promise = new Promise(function(resolve, reject) {
  // ...
  if (/* 异步操作成功 */){
    resolve(value);
  } else {/* 异步操作失败 */
    reject(error);
  }
});
{% endcodeblock %}
上面代码中，Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，不用自己实现。

resolve 函数的作用是，将 Promise 实例的状态从“未完成”变为“成功”（即从 pending 变为 fulfilled ），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。
reject 函数的作用是，将 Promise 实例的状态从“未完成”变为“失败”（即从 pending 变为 rejected ），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

## 2. 状态
Promise 对象通过自身的状态，来控制异步操作。Promise 实例具有三种状态。
1、异步操作未完成（pending）
2、异步操作成功（fulfilled）
3、异步操作失败（rejected）

上面三种状态里面，fulfilled 和 rejected 合在一起称为 resolved（已定型）。

这三种的状态的变化途径只有两种。
1、从“未完成”到“成功”
2、从“未完成”到“失败”

一旦状态发生变化，就凝固了，不会再有新的状态变化。

因此，Promise 的最终结果只有两种。

1、异步操作成功，Promise 实例传回一个值（value），状态变为 fulfilled。
2、异步操作失败，Promise 实例抛出一个错误（error），状态变为 rejected。

## 3. Resolve
处理异步的成功状态 
#### 3.1. 普通方式
{% codeblock lang:'javascript' line_number:'true' %}
let p = new Promise((resolve) => {
  setTimeout(() => { 
    let result = 1;
    resolve(result); 
  }, 1000)
})

p.then((result)=>{ console.log(result) })
{% endcodeblock %}

#### 3.2. 快捷方式
{% codeblock lang:'javascript' line_number:'true' %}
let p = Promise.resolve(1)

p.then((result)=>{ console.log(result) })
{% endcodeblock %}

## 4. Reject
处理异步的失败状态
#### 4.1 普通方式
{% codeblock lang:'javascript' line_number:'true' %}
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    let result = 2;
    reject(result);
  }, 1000)
})
// 有两种方式获取失败状态
// 第一种，通过 then 第二个函数参数处理失败状态
p.then((result)=>{ 
  console.log('success:',result);
}, (err)=>{ 
  console.log('fail:',err);
})
// "fail: 2"

// 第二种，或者通过，catch 获取失败状态
p.then((result)=>{ 
  console.log('success:',result);
}).catch((err)=>{ 
  console.log('error:',err);
})
// "error: 2"

// 注意：如果两种方式同时使用的话
// 只会处理第一种方式操作的结果
p.then((result)=>{ 
  console.log('success:',result);
}, (err)=>{ 
  console.log('fail:',err);
}).catch((err)=>{ 
  console.log('error:',err);
})
// "fail: 2"
{% endcodeblock %}

#### 4.2 快捷方式
{% codeblock lang:'javascript' line_number:'true' %}
let p = Promise.reject(2)

p.then(null, (err) => console.log('fail:', err))

// 或
p.then().catch((err) => console.log('error:', err))
{% endcodeblock %}

## 5. Catch
从上述 reject 的使用过程中，会发现, catch 操作在没有设置 onRejected 处理的时候，会被 catch 捕获失败处理。同时 catch 也会捕获 onResolved 和 onRejected 中出现的错误。

#### 5.1. 直接捕获 reject
{% codeblock lang:'javascript' line_number:'true' %}
let p = new Promise((resolve, reject) => {
    reject(3)
});

p.then((result) => {
  console.log('success:', result)
}).catch((err) => {
  console.log('error:', err)
})
// "error: 3"
{% endcodeblock %}

#### 5.2. 捕获 onResolved 中的异常
{% codeblock lang:'javascript' line_number:'true' %}
let p = new Promise((resolve) => {
  resolve(3)
});

p.then((result) => {
  throw new Error('custom resolve error!')
  console.log('success:', result)
}).catch((err) => {
  console.log('Custom error:', err)
})
// "Custom error: Error: custom resolve error!"
{% endcodeblock %}

#### 5.3. 捕获 onRejected 中的异常
{% codeblock lang:'javascript' line_number:'true' %}
let p = new Promise((resolve) => {
  reject(3)
});

p.then(null, (err) => {
  throw new Error('custom reject error!')
  console.log('fail:', err)
}).catch((err) => {
  console.log('Custom error:', err)
})
// "Custom error: Error: custom reject error!"
{% endcodeblock %}

## 6. 参考链接
· [Promise 对象][]

[Promise 对象]: http://es6.ruanyifeng.com/#docs/promise