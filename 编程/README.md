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

### 2. 字符串正则去重
