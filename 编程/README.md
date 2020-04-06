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

### 2. 实现sum函数(计算只在最后进行一次)
要求：  
sum(1,2).result === 3  
sum(1,2)(3).result === 6  
sum(1,2)(3,4).result === 10  
sum(1,2)(3,4)(5).result === 15  

    function sum(){
        var args = [...arguments];
        var funcRes = function(){
            args.push(...arguments);
            return funcRes;
        }

        Object.defineProperty(funcRes, 'result', {
            get: function(){
                return args.reduce((a,b)=>{return a+b;})
            }
        });
        return funcRes;
    }
    console.log(sum(1,2)(3).result);
    console.log(sum(1,2)(3,4).result);
    console.log(sum(1,2)(3,4)(5).result);

### 3.实现一个GoodMan，要求：  
```
GoodMan("Tom") 输出：  
I am Tom  

GoodMan("Tom").rest(10).learn("computer") 输出：  
I am Tom 
//等待10秒
Start learning after 10 seconds
Learning computer

GoodMan("Tom").restFirst(5).learn("chinese") 输出：  
//等待5秒
Start learning after 5 seconds
I am Tom
Learning chinese
```
这题我…不…会…