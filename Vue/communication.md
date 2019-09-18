### Vue通信方式

##### 1. 父子组件通信  
- 父组件向子组件传值  
    父组件向子组件传值是通过props实现的。
    - 子组件在props中创建一个属性，用以接收父组件传过来的值；
    - 父组件中注册子组件；
    - 在子组件标签中添加子组件props中创建的属性；
    - 把需要传给子组件的值赋给该属性。  

- 子组件向父组件传值  
    子组件传递数据给父组件是通过$emit触发事件来做到的。
    - 子组件中需要以某种方式如点击事件的方法来触发一个自定义事件；
    - 将需要传的值作为$emit的第二个参数，该值将作为实参传给响应自定义事件的方法；
    - 在父组件中注册子组件并在子组件标签上绑定对自定义事件的监听。
 
##### 2. 利用总线方式可以平级组件进行通信
对于兄弟组件可以使用中央事件总线的方式来进行通信。新建一个Vue事件eventBus对象，然后通过eventBus.$emit触发事件，eventBus.$on监听触发的事件。

eventBus.js
```
import Vue from 'vue'
export default new Vue
```
eventBus中只创建了⼀个新的Vue实例，以后它就承担起了组件之间通信的桥梁了，也就是中央事件总线。

firstChild.vue
```
<template>
    <div>
        <h2>firstChild组件</h2>
        <button @click="sendMsg">向另一个组件传值</button>
    </div>
</template>

<script>
    import bus from './eventBus'
    export default {
        methods: {
            sendMsg: function(){
                bus.$emit('userDefinedEvent', 'this message is from firstChild')
            }
        }
    }
</script>
```

secondChild.vue
```
<template>
    <div>
        <h2>secondChild组件</h2>
        <p>从firstchild接收的字符串参数： {{message}}</p>
    </div>
</template>

<script>
    import bus from './eventBus'
    export default {
        data() {
            return {
                message: "默认值"
            }
        },
        mounted() {
            var self = this
            bus.$on('userDefinedEvent', function(msg){
                self.message = msg
            })
        }
    }
</script>
```