### 1. 实现getElementsByClassName
    function getElementsByClassName(tagName,className) {
        var tag = document.getElementsByTagName(tagName);
        var tagAll = [];
        for(var i = 0 ; i<tag.length ; i++){
            if(tag[i].className.indexOf(className) != -1){
                tagAll[tagAll.length] = tag[i];
            }
        }
        return tagAll;
    }
 原理就是通过获取指定的标签，使用getElementsByTagName来获取标签的内容，然后根据标签的className跟传进来的参数进行对比，如果相等就放入数组中最后返回。   

### 2. 输出结果
-
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
