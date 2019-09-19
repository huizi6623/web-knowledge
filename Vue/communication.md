### Vue通信方式

#### 1. 父子组件通信  
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
 
#### 2. 利用总线方式可以平级组件进行通信
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
在响应点击事件的sengMsg函数中用$emit触发了一个自定义的userDefinedEvent事件，并传递了一个字符串参数  
**PS:** $emit实例方法触发当前实例（这里的当前实例就是bus)上的事件，附加参数都会传给监听器回调。  
应用场景：表单联动时。

#### 3. $parent和$children
$parent是当前实例的父实例，$children是当前实例的直接子组件。

parent.vue
```
<template>
    <div class="parent">
        <h2>$parent和$children</h2>
        <p>父组件中的值： {{parentMessage}}</p>
        <button @click="changeChildMsg">改变子组件中的值</button>
        <Child/>
    </div>
</template>

<script>
    import Child from './Child'
    export default {
        name: 'parent',
        components: {
            Child
        },
        data(){
            return {
                parentMessage: '默认值'
            }
        },
        methods: {
            changeChildMsg: function(){
                this.$children[0].childMessage = "这是父组件改变的"
            }
        }
    }
</script>
```

child.vue
```
<template>
    <div>
        <h3>子组件部分</h3>
        <p>子组件中的值： {{childMessage}}</p>
        <button @click="changeParentMsg">改变父组件中的值</button>
    </div>
</template>

<script>
    export default {
        name: 'child',
        data(){
            return {
                childMessage: '默认值'
            }
        },
        methods: {
            changeParentMsg: function(){
                this.$parent.parentMessage = '这是子组件改变的'
            }
        }
    }
</script>
```

**PS:** 需要注意$children并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用$children来进行
数据绑定，考虑使用一个数组配合v-for来生成子组件，并且使用Array作为真正的来源。

#### 4. provide和inject
provide/inject是2.2.0新增的属性，可以从一个祖先组件向所有子孙后代注入依赖。  
provide/inject:简单来说就是在父组件中通过provide来提供变量，然后在子组件中通过inject来注入变量。   
以上两者可以在父组件与子组件、孙子组件、曾孙子组件…数据交互，也就是说不仅限于prop的父子组件数据交互，
只要在上一层级中生命的provide，那么下一层级无论多深都能够通过inject来访问到provide的数据。

parent.vue
```
<template>
    <div class="parent">
        <h2>Provide和inject</h2>
        <Child />
    </div>
</template>

<script>
    import Child from './Child'
    export default {
        name: 'parent',
        provide: {
            name: 'Garrett'
        },
        components: {
            Child
        }
    }
</script>
```

child.vue
```
<template>
    <div>
        <h3>子组件部分</h3>
        <GrandChild/>
    </div>
</template>

<script>
    import GrandChild from './GrandChild'
    export default {
        name: 'Child',
        components: {
            GrandChild
        }
    }
</script>
```

grandChild.vue
```
<template>
    <div>
        <h3>孙子组件部分</h3>
        <p>{{name}}</p>
    </div>
</template>

<script>
    export default {
        name: 'grandChild',
        inject: ['name'],
    }
</script>
```

**PS:** provide和inject主要是为高阶插件/组件库提供用例，并不推荐直接用于应用程序代码中。

#### 5. $attrs和$listeners
$attrs和$listeners是2.4.0新增的方法。  
$attrs继承所有的父组件属性（除了props传递的属性、class和style）  
$listeners属性，是一个对象，里面包含了作用在这个组件上的所有监听器，可以配合v-on="$listeners"将
所有的事件监听器指向这个组件的某个特定的子元素。

parent.vue
```
<template>
    <div class="parent">
        <h2>$attrs和$listeners</h2>
        <p>父组件中的两个值：</p>
        <p>子组件会改变的值：{{message1}}</p>
        <p>孙子组件会改变的值：{{message2}}</p>
        <hr>
        <!--        此处监听了两个事件，可以在B组件或者C组件中直接触发-->
        <child1 :child="child" :grand-child="grandChild" v-on:changeMsg1="changeMsg1" v-on:changeMsg2="changeMsg2"/>
    </div>
</template>
<script>
    import Child1 from './Child.vue'
    export default {
        data() {
            return {
                child: 'child',
                grandChild: 'grandChild',
                message1: '默认值',
                message2: '默认值'
            };
        },
        components: {Child1},
        methods: {
            changeMsg1(msg) {this.message1 = msg},
            changeMsg2(msg) {this.message2 = msg}
        }
    };
</script>
```

child.vue
```
<template>
    <div>
        <p>in child:</p>
        <p>props: {{child}}</p>
        <p>$attrs: {{$attrs}}</p>
        <button @click="changeMsg">改变父组件的值</button>
        <hr>
        <!-- GrandChild组件中能直接触发changeMsg的原因在于 Child组件调用GrandChild组件时 使用 v-on 绑定了$listeners 属性 -->
        <!-- 通过v-bind 绑定$attrs属性，GrandChild组件可以直接获取到Parent组件中传递下来的props（除了Child组件中props声明的） -->
        <GrandChild v-bind="$attrs" v-on="$listeners"></GrandChild>
    </div>
</template>
<script>
    import GrandChild from './GrandChild.vue';
    export default {
        props: ['child'],
        data() {
            return {};
        },
        inheritAttrs: false,
        components: {GrandChild},
        methods: {
            changeMsg: function(){
                this.$emit('changeMsg1', '这是子组件改变的');
            }
        }
    };
</script>
```

grandChild.vue
```
<template>
    <div>
        <p>in grandChild:</p>
        <p>props: {{grandChild}}</p>
        <p>$attrs: {{$attrs}}</p>
        <button @click="changeMsg">改变祖先组件的值</button>
    </div>
</template>
<script>
    export default {
        props: ['grandChild'],
        inheritAttrs: false,
        methods: {
            changeMsg: function(){
                this.$emit('changeMsg2', '这是孙子组件改变的');
            }
        }
    };
</script>
```

### 6.VueX
官网：https://vuex.vuejs.org/zh/guide/  

先引用vuex官网的话：  
> Vuex是⼀个专为Vue.js应⽤程序开发的状态管理模式。它采⽤集中式存储管理应⽤的所有组件的状态，并
  以相应的规则保证状态以⼀种可预测的⽅式发⽣变化。
  
状态管理模式、集中式存储管理，⼀听就很⾼⼤上，蛮吓⼈的。在我看来vuex就是把需要共享的变量全部存
储在⼀个对象⾥⾯，然后将这个对象放在顶层组件中供其他组件使⽤。这么说吧，将vue想作是⼀个js⽂件、
组件是函数，那么vuex就是⼀个全局变量，只是这个“全局变量”包含了⼀些特定的规则⽽已。

vuex包含有五个基本的对象：  
- state：存储状态，也就是变量；
- getters：派生状态，也就是set、get中的get，有两个可选参数：state、getters分别可以获取state中的
变量和其他getters。外部调用方式：store.getters.personInfo()，就和vue的computed差不多。
- mutations：提交修改状态。也就是set、get中的set，这是vuex中唯一修改state的方式，但不支持异步操作。
第一个默认参数是state。外部调用方式：store.commit('SET_AGE', 18)。和vue中的methods类似。
- actions：和mutations类似。不过actions⽀持异步操作。第⼀个参数默认是和store具有相同参数属性的
对象。外部调⽤⽅式：store.dispatch('nameAsyn')。
- modules：store的⼦模块，内容就相当于是store的⼀个实例。调⽤⽅式和前⾯介绍的相似，只是要加上
  当前⼦模块名，如：store.a.getters.xxx()。
  
一般来讲，我们都会采用vue-cli来进行实际的开发，在vue-cli中，开发和调用方式稍微不同。
```
├── index.html
├── main.js
├── components
└── store
    ├── index.js # 我们组装模块并导出 store 的地⽅
    ├── state.js # 根级别的 state
    ├── getters.js # 根级别的 getter
    ├── mutations.js # 根级别的 mutation
    ├── actions.js # 根级别的 action
    └── modules
        ├── m1.js # 模块1
        └── m2.js # 模块2
```

state.js示例：
```
const state = {
    name: 'weish',
    age: 22
};
export default state;
```

getters.js示例（一般使用getters来过去state的状态，而不是直接使用state）：
```
export const getName = (state) => {
    return state.name;
}
export const getAge = (state) => {
    return state.age
}
```

mutations.js示例：
```
export default {
    setName(state, name) {
        state.name = name;
    },
    setAge(state, age) {
        state.age = age;
    }
};
```

actions.js示例（异步操作，多个commit时）：
```
export default {
    nameAsyn({commit}, {age, name}) {
        commit('setName', name);
        commit('setAge', age);
    }
};
```

modules.js示例（如果不是很复杂的应用，一般是不会分模块的）：
```
export default {
    state: {},
    getters: {},
    mutations: {},
    actions: {}
};
```

index.js示例（组装vuex）：
```
import vue from 'vue';
import vuex from 'vuex';
import state from './state.js';
import * as getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';
import m1 from './modules/m1.js';
import m2 from './modules/m2.js';
vue.use(vuex);
export default new vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        m1,
        m2
    }
});
```

最后将store实例挂载到main.js里面的vue上去就行了
```
import store from './store/index.js';
new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
```

在vue组件中使⽤时，我们通常会使⽤mapGetters、mapActions、mapMutations，然后就可以按照vue
调⽤methods和computed的⽅式去调⽤这些变量或函数，⽰例如下：
```
import {mapGetters, mapMutations, mapActions} from 'vuex';
/* 只写组件中的script部分 */
export default {
    computed: {
        ...mapGetters([
            'name',
            'age'
        ])
    },
    methods: {
        ...mapMutations({
            setName: 'SET_NAME',
            setAge: 'SET_AGE'
        }),
        ...mapActions([
            nameAsyn
        ])
    }
};
```

#### 7. 总结
常见使用场景可以分为三类：
- 父子通信：
    - 父向子传递数据通过props，子向父是通过events($emit)；
    - 通过父链/子链也可以通信（$parent/$children）；
    - ref也可以访问组件实例；
    - provide/inject API；
    - $attrs/$listeners;
- 兄弟通信
    - Bus总线方式；
    - VueX;
- 跨级通信；
    - Bus;
    - VueX;
    - provide/indect;
    - $attrs/$listeners;

