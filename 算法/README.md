#### 1. 从二叉树的根到叶子节点称为一条路径，路径上每个节点的value之和为路径和值，本题要求所有的路径中是否存在一条和值为N的路径
（头条）
```
// node节点构造函数
function Node(value){
    this.value = value;
    this.left = null;
    this.right = null;
}

// 方法实现
function findRoad(root, total){
    if(root === null){
        return [];
    }
    let res = [];
    computedTree(root, [], 0, res, total);
    return res;
}

function computedTree(node, path, sum, res, total){
    if(node === null){
        return ;
    }

    let newPath = path.concat(node.value);
    sum += node.value;
    if(node.left === null && node.right === null && sum === total){
        res.push(newPath);
        return ;
    }
    computedTree(node.left, newPath, sum, res, total);
    computedTree(node.right, newPath, sum, res, total);
}
```
#### 2. 写一个function find(dataList, where){},找到dataList中指定where的数据
where结构 {id: 111}

![](images/findWhere.png)
```
function find(dataList, where){
    const {id} = where;
    const len = dataList.length;

    for(let i = 0; i < len; i ++){
        console.log(dataList[i].id);
        if (dataList[i].id === id) {
            return dataList[i];
        } else if (dataList[i].children.length) {
            let res = find(dataList[i].children, where);
            if(res) {
                return res;
            }
        }
    }
    return null;
}
```
