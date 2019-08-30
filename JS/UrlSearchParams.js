// 自实现UrlSearchParams接口

class UrlSearchParams2 {
    constructor(searchData){
        this.search = this._initData(searchData);
    }
    // 初始化数据
    _initData(data){
        if(typeof data === 'string'){
            let str = data.substring(data.indexOf('?') + 1);
            let params = str.split('&');
            let arr = [];
            for(let i = 0; i < params.length; i ++){
                let param = params[i].split('=');
                arr.push([param[0], param[1]])
            }
            return arr;
        } else if(data instanceof Object){
            let arr = [];
            for(let key in data){
                arr.push([key, data[key]])
            }
            return arr;
        }
    }

    append(key, value){
        this.search.push([key, value]);
    }

    toString(){
        let res = this.search.reduce((pre, cur) => {
            return pre + cur.join('=') + '&'
        }, '');
        return res.replace(/&$/, '');
    }

    delete(key){
        for(let i = 0; i < this.search.length; i ++){
            if(this.search[i][0] === key){
                this.search.splice(i, 1);
                i -- ;
            }
        }
    }

    get(key){
        for(let i = 0; i < this.search.length; i ++){
            if(this.search[i][0] === key){
                return this.search[i][1];
            }
        }
    }

    getAll(key){
        return this.search.reduce((pre, cur) => {
            cur[0] === key ? pre.push(cur[1]) : pre;
            return pre;
        }, []);
    }

    has(key){
        for(let i = 0; i < this.search.length; i ++){
            if(this.search[i][0] === key){
                return true;
            }
        }
        return false;
    }

    set(key, value){
        let flag = true;
        for(let i = 0; i < this.search.length; i ++){
            if(this.search[i][0] === key){
                if(flag){
                    this.search[i][1] = value;
                    flag = false;
                } else {
                    this.search.splice(i, 1);
                    i -- ;
                }
            }
        }
    }

    keys(){
        return this.iterator(0);
    }

    values(){
        return this.iterator(1);
    }

    entries() {
        return this.iterator(2);
    }

    iterator(param){
        let values = this.search.reduce((pre, cur) => {
            param === 2 ? pre.push(cur) : pre.push(cur[param]);
            return pre;
        }, []);
        let count = 0;
        return {
            next() {
                return count < values.length ?
                    {value: values[count++], done: false} :
                    {value: undefined, done: true}
            }
        }
    }

    // 定义遍历器
    *[Symbol.iterator]() {
        let len = this.search.length;
        for(let i = 0; i < len; i ++) {
            yield this.search[i];
        }
    }
}

let obj = {
    aaa: 'bbb',
    ccc: 'ddd1'
};
let url2 = new UrlSearchParams2(obj);

for(let key of url2){
    console.log(key);
}
url2.append('aaa', 'sss');
console.log(url2.get('aaa'));
console.log(url2.getAll('aaa'));

url2.toString();
