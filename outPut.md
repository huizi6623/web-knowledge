```
function foo(){
    var a = 1;
    let b = 2;
    {
        let b = 3;
        var c = 4;
        let d = 5;
        console.log(a);
        console.log(b);
    }
    console.log(b);
    console.log(c);
    console.log(d);
}
foo();
```
答案：1 3 2 4 报错：Uncaught ReferenceError: d is not defined

---
```
document.body.addEventListener('click', () => {
 Promise.resolve().then(()=>console.log(1));
 console.log(2)
});
document.body.addEventListener('click', () => {
 Promise.resolve().then(()=>console.log(3));
 console.log(4)
});
```
答案： 2 1 4 3

---
```
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}

console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0);
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}
).then(function() {
    console.log('promise2');
});
console.log('script end');
```
答案：  
script start  
async1 start  
async2  
promise1  
script end  
async1 end  
promise2  
setTimeout

---
```
// dom结构
<div class="outer">
    <div class="inner"></div>
</div>

// script脚本
const outer = document.querySelector('.outer');
const inner = document.querySelector('.inner');

function onClick(e){
    console.log(e.target.className);
    console.log(e.currentTarget.className);

    setTimeout(() => console.log('timeout'), 0);

    requestIdleCallback(() => {
        console.log('idle');
    });

    requestAnimationFrame(() => {
        console.log('raf');
    });

    new Promise(resolve => {
        console.log('resolve');
        resolve();
    }).then(() => {
        console.log('promise');
    });

    console.log('finish');
}

outer.addEventListener('click', onClick);
inner.addEventListener('click', onClick);
```
点击outer输出：  
outer  
outer  
resolve  
finish  
promise  
raf  
timeout（输出位置不确定）  
idle  

点击inner输出：  
inner  
inner  
resolve  
finish  
promise  
inner  
outer  
resolve  
finish   
promise  
raf  
raf  
timeout（输出位置不确定）  
timeout（输出位置不确定）  
idle  
idle   

window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发人员能够
在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。
函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，
则有可能为了在超时前执行函数而打乱执行顺序。requestAnimationFrame是高优先级任务，
requestIdleCallback是低优先级任务，所以idle一定在raf后面，但是timeout顺序不确定，可能在raf之前、之后、idle之后。  
e.target代表的是触发的目标dom，currentTarget代表的是处于冒泡或者捕获阶段的dom。

```
var a = 0;
{
    a = 1;
    function a(){}
    a = 21;
    console.log(a);
}
console.log(a)
```
21 1  
参考文档https://zhuanlan.zhihu.com/p/100856823