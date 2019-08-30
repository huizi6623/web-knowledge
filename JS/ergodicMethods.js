// 遍历方法对比

var arr = []
for (var i = 0; i < 1000000; i++) {
    arr[i] = i;
}
var start = +new Date();
for (var j = 0; j < arr.length; j++) {
    arr[j] = j;
}
console.log("for正序序循环耗时：%s ms", Date.now() - start);
var start = +new Date();
for (var j = arr.length - 1; j > -1; j--) {
    arr[j] = j;
}
console.log("for倒序循环耗时：%s ms", Date.now() - start);
var start = +new Date();
arr.forEach((v, index) => {
    v = index
})
console.log("foreach循环耗时：%s ms", Date.now() - start);
var start = +new Date();
for(var i in arr){
    arr[i] = i
}
console.log("foreach循环耗时：%s ms", Date.now() - start);
