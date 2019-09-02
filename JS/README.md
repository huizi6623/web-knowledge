### [原型链与继承]（原型链与继承.md)

### 1. js的各种假值
'', false, 0, null, undefined, NaN
- false 与 0、'' 比较为true
- null 和 undefined 比较为true
- 0 和false、''、 [] 比较为true
  - ![] == false
  - [] == false
- '' 和 false、 0 比较为true
- null 和 undefined 比较为true
  - null == undefined，双等时两者相等，且除了自身，仅与null、nudefined比较会返回true
- NaN与任何值都不想等，包括自身
  - ES6 中 Object.is(NaN, NaN) 返回true

### 2. js各种循环性能对比

- #### 正序和倒序，倒序循环是编程语言中常用的性能优化方法  

    通常不会感觉到性能差异，但是在数据量很大时中，比如下面的代码：
      
    ```
    var arr=[]
    for (var i = 0; i < 1000000; i++) {
    arr[i] = i;
    }
    var start = +new Date();
    for (var j = 0; j < arr.length; j++) {
    arr[j] = j;
    }
    console.log("for正序序循环耗时：%s ms", Date.now() - start);
    var start = +new Date();
    for (var j = arr.length-1; j>-1; j--) {
    arr[j] = j;
    }
    console.log("for倒序循环耗时：%s ms", Date.now() - start); 
    var start = +new Date();
    arr.forEach((v,index)=>{
    v=index
    })
    console.log("foreach循环耗时：%s ms", Date.now() - start);
    ```
    
    经测试，
    
    循环1万次，输出：  
    for正序序循环耗时：1 ms  
    for倒序循环耗时：1 ms  
    foreach循环耗时：1 ms
    
    循环10万次，输出： 
    for正序序循环耗时：5 ms  
    for倒序循环耗时：3 ms  
    foreach循环耗时：2 ms 
    
    循环1百万次，输出： 
    for正序序循环耗时：20 ms  
    for倒序循环耗时：5 ms  
    foreach循环耗时：21 ms 
    
    循环1千万次，输出;  
    for正序序循环耗时：176 ms  
    for倒序循环耗时：25 ms  
    foreach循环耗时：217 ms  

- #### 如果缓存数组长度

    ```
    var arr=[]
    for (var i = 0; i < 10000000; i++) {
    arr[i] = i;
    }
    var start = +new Date();
    for (var j = 0; j < length; j++) {
    arr[j] = j;
    }
    console.log("for正序序循环耗时：%s ms", Date.now() - start);
    var start = +new Date();
    for (var j = length-1; j>-1; j--) {
    arr[j] = j;
    }
    console.log("for倒序循环耗时：%s ms", Date.now() - start); 
    ```
    
    把之前的arr.length换成length，输出： 
    for正序序循环耗时：0 ms  
    for倒序循环耗时：0 ms  
    性能得到了很大提升。 
    
    总结： 
    1.大数据量循环，尽量用倒序排序，至于倒序为什么性能更好，有知道的可以留言  
    2.for和foreach的性能相近，在数据量很大，比如一千万时，foreach因为内部封装，比for更耗时  
    3.减少对象成员和数组项的查找，比如缓存数组长度，避免每次查找数组 length 属性 
