### 1. 原理
[参考文档](https://juejin.im/post/5cc26dfef265da037b611738#heading-8)

- 核心概念
    JavaScript的模块打包工具（module bundler）。通过分析模块之间的依赖，最终将所有模块打包成
    一份或者多份代码包（bundler）,供html直接引用。实质上，Webpack仅仅提供了**打包功能**和一套**文件处理机制**，
    然后通过生态中的各种Loader和Plugin对代码进行预编译和打包。因此Webpack具有高度的可拓展性，
    能更好的发挥社区生态的力量。
    - Entry：入口文件，Webpack会从该文件进行分析和编译；
    - Output：出口路径，打包后创建bundler的文件路径以及文件名；
    - Module：模块，在Webpack中任何文件都可以作为一个模块，会根据配置的不同的Loader进行加载和打包；
    - Chunk：代码块，可以根据配置，将所有代码块合并成一个或多个代码块，以便按需加载，提高性能；
    - Loader：模块加载器，进行各种文件类型的加载与转换；
    - Plugin：拓展插件，可以通过Webpack相应的事件钩子，介入到打包过程中的任意环节，从而对代码块按需修改；

- 工作流程（加载-编译-输出）
    - 读取配置文件，按命令初始化配置参数，创建Compiler对象；
    - 调用插件的apply方法挂载插件监听，然后从入口文件开始执行编译；
    - 按文件类型，调用相应的Loader对模块进行编译，并在合适的时机点触发对应的事件，调用Plugin执行，最后
    再根据模块依赖查找到所有依赖的模块，递归执行第三步；
    - 将编译后的所有代码包装成一个个代码块（Chunk），并按依赖和配置确定输出内容。这个步骤，仍然可以通过Plugin
    进行文件的修改；
    - 最后，根据Output把文件内容一一写入到指定的文件夹中，完成整个过程。

- 总结
    - 模块机制：Webpack自己实现了一套模拟模块的机制，将其包裹于业务代码的外部，从而提供了一套模块机制；
    - 文件编译：Webpack规定了一套编译规则，通过Loader和Plugin，以管道的形式对文字字符串进行处理；

### 2. Loader
由于Webpack是基于Node，其实只能识别js模块，比如Css/Html/图片等类型的文件无法加载，因此就需要一个对不同格式文件转换器。
其实Loader做的事，也不难理解：**对Webpack传入的字符串进行按需修改**。  
例如一个最简单的Loader:
```
// html-loader/index.js
module.exports = function(htmlSource) {
	// 返回处理后的代码字符串
	// 删除 html 文件中的所有注释
	return htmlSource.replace(/<!--[\w\W]*?-->/g, '')
}
```
当然，实际的Loader不会这么简单，通常是需要将代码进行分析，构建AST(抽象语法树)，遍历进行定向的修改后，再重新生成
新的代码字符串。如我们常用的Babel-loader会执行以下步骤：
- babylon 将 ES6/ES7 代码解析成 AST
- babel-traverse 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 babel-generator 转换成 ES5

**Loader特性**
- 链式传递，按照配置时相反的顺序链式执行；
- 基于Node环境，拥有较高权限，比如文件的增删改查；
- 可同步也可异步；

**编写原则**
- 单一原则：每个Loader只做一件事；
- 链式调用：Webpack会按顺序链式调用每个Loader;
- 统一原则：遵循Webpack制定的设计规则和结构，输入与输出均为字符串，各个Loader完全独立，即插即用；

**常用Loader**
- file-loader: 加载文件资源，如 字体 / 图片 等，具有移动/复制/命名等功能；
- url-loader: 通常用于加载图片，可以将小图片直接转换为 Date Url，减少请求；
- babel-loader: 加载 js / jsx 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题；
- ts-loader: 加载 ts / tsx 文件，编译 TypeScript；
- style-loader: 将 css 代码以`<span>`标签的形式插入到 html 中；
- css-loader: 分析@import和url()，引用 css 文件与对应的资源；
- postcss-loader: 用于 css 的兼容性处理，具有众多功能，例如 添加前缀，单位转换 等；
- less-loader / sass-loader: css预处理器，在 css 中新增了许多语法，提高了开发效率；

### 3. Plugin
插件系统是Webpack成功的一个关键因素。在编译的整个生命周期中，Webpack会触发许多事件钩子，plugin可以监听
这些事件，根据需求在相应的时间点对打包内容进行定向的修改。
- 一个最简单的plugin是这样的：
```
class Plugin{
  	// 注册插件时，会调用 apply 方法
  	// apply 方法接收 compiler 对象
  	// 通过 compiler 上提供的 Api，可以对事件进行监听，执行相应的操作
  	apply(compiler){
  		// compilation 是监听每次编译循环
  		// 每次文件变化，都会生成新的 compilation 对象并触发该事件
    	compiler.plugin('compilation',function(compilation) {})
  	}
}
```
- 注册插件：
```
// webpack.config.js
module.export = {
	plugins:[
		new Plugin(options),
	]
}
```
- 事件流机制  
    Webpack就像工厂中的一条产品流水线。原材料经过Loader与Plugin的一道道处理，最后输出结果。   
    - 通过链式调用，按顺序串起一个个Loader;
    - 通过事件流机制，让Plugin可以插入到整个生产过程中的每个步骤中；
    
    Webpack事件流编程范式的核心是基础类Tapable，是一种观察者模式，实现事件的订阅与广播：
    ```
    const { SyncHook } = require("tapable")
    
    const hook = new SyncHook(['arg'])
    
    // 订阅
    hook.tap('event', (arg) => {
        // 'event-hook'
        console.log(arg)
    })
    
    // 广播
    hook.call('event-hook')
    ```
    webpack中两个最重要的类Compiler与Compilation便是继承于Tapable，也用友这样的事件流机制。
    - Compiler：可以简单的理解为**Webpack实例**，它包含了当前Webpack的所有配置信息，如options,loaders,plugins
    等信息，全局唯一，只在启动时完成舒适化创建，随着生命周期逐一传递；
    - Compilation：可以称为**编译实例**。当监听到文件发生改变时，Webpack会创建一个新的COmpilation
    对象，开始一次新的编译。它包含了当前的输入资源，输出资源，变化的文件等，同时通过它提供的api，
    可以监听每次编译过程触发的事件钩子；
    - 区别：
        - Compiler全局唯一，且从启动生存到结束；
        - Compilation对应每次编译，每轮编译循环均会重新创建；
    - 常用Plugin：
        - UglifyJsPlugin: 压缩、混淆代码；
        - CommonsChunkPlugin: 代码分割；
        - ProvidePlugin: 自动加载模块；
        - html-webpack-plugin: 加载 html 文件，并引入 css / js 文件；
        - extract-text-webpack-plugin / mini-css-extract-plugin: 抽离样式，生成 css 文件；
        - DefinePlugin: 定义全局变量；
        - optimize-css-assets-webpack-plugin: CSS 代码去重；
        - webpack-bundle-analyzer: 代码分析；
        - compression-webpack-plugin: 使用 gzip 压缩 js 和 css；
        - happypack: 使用多进程，加速代码构建；
        - EnvironmentPlugin: 定义环境变量；
   
### 4. 编译优化
- 代码优化:
    - 无用代码消除，是许多编程语言都具有的优化手段，这个过程称为 DCE (dead code elimination)，即 删除不可能执行的代码；
        - 例如我们的 UglifyJs，它就会帮我们在生产环境中删除不可能被执行的代码，例如:
        ```
         var fn = function() {
          	return 1;
          	// 下面代码便属于 不可能执行的代码；
          	// 通过 UglifyJs (Webpack4+ 已内置) 便会进行 DCE；
          	var a = 1;
          	return a;
          }
        ```
    - 摇树优化 (Tree-shaking)，这是一种形象比喻。我们把打包后的代码比喻成一棵树，这里其实表示的就是，通过工具 "摇" 我们打包后的 js 代码，将没有使用到的无用代码 "摇" 下来 (删除)。即 消除那些被 引用了但未被使用 的模块代码。
        - 原理: 由于是在编译时优化，因此最基本的前提就是语法的静态分析，ES6的模块机制 提供了这种可能性。不需要运行时，便可进行代码字面上的静态分析，确定相应的依赖关系。
        - 问题: 具有 副作用 的函数无法被 tree-shaking。
            - 在引用一些第三方库，需要去观察其引入的代码量是不是符合预期；
            - 尽量写纯函数，减少函数的副作用；
            - 可使用 webpack-deep-scope-plugin，可以进行作用域分析，减少此类情况的发生，但仍需要注意；

- code-spliting: 代码分割 技术，将代码分割成多份进行 懒加载 或 异步加载，避免打包成一份后导致体积过大，影响页面的首屏加载；
    - Webpack 中使用 SplitChunksPlugin 进行拆分；
    - 按 页面 拆分: 不同页面打包成不同的文件；
    - 按 功能 拆分:
        - 将类似于播放器，计算库等大模块进行拆分后再懒加载引入；
        - 提取复用的业务代码，减少冗余代码；
    - 按 文件修改频率 拆分: 将第三方库等不常修改的代码单独打包，而且不改变其文件 hash 值，能最大化运用浏览器的缓存；
  
- scope hoisting: 作用域提升，将分散的模块划分到同一个作用域中，避免了代码的重复引入，有效减少打包后的代码体积和运行时的内存损耗；
- 编译性能优化:
    - 升级至 最新 版本的 webpack，能有效提升编译性能；
    - 使用 dev-server / 模块热替换 (HMR) 提升开发体验；
        - 监听文件变动 忽略 node_modules 目录能有效提高监听时的编译效率；
    - 缩小编译范围:
        - modules: 指定模块路径，减少递归搜索；
        - mainFields: 指定入口文件描述字段，减少搜索；
        - noParse: 避免对非模块化文件的加载；
        - includes/exclude: 指定搜索范围/排除不必要的搜索范围；
        - alias: 缓存目录，避免重复寻址；
    - babel-loader:
        - 忽略node_moudles，避免编译第三方库中已经被编译过的代码；
        - 使用cacheDirectory，可以缓存编译结果，避免多次重复编译；
    - 多进程并发:
        - webpack-parallel-uglify-plugin: 可多进程并发压缩 js 文件，提高压缩速度；
        - HappyPack: 多进程并发文件的 Loader 解析；
    - 第三方库模块缓存:
        - DLLPlugin 和 DLLReferencePlugin 可以提前进行打包并缓存，避免每次都重新编译；
    - 使用分析:
        - Webpack Analyse / webpack-bundle-analyzer 对打包后的文件进行分析，寻找可优化的地方；
        - 配置profile：true，对各个编译阶段耗时进行监控，寻找耗时最多的地方； 
    - source-map:
        - 开发: cheap-module-eval-source-map；
        - 生产: hidden-source-map；

### 5. devServe.Proxy
https://segmentfault.com/a/1190000016314976  
https://webpack.docschina.org/configuration/dev-server/#devserver-proxy

(1)如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。  
(2)解决开发环境的跨域问题

#### 1. 使用方式
- 在 localhost:3000 上有后端服务的话，你可以这样启用代理：
    ```
    module.exports = {
      //...
      devServer: {
        proxy: {
          '/api': 'http://localhost:3000'
        }
      }
    };
    ```
    请求到 /api/users 现在会被代理到请求http://localhost:3000/api/users。
    
- 如果你不想始终传递 /api ，则需要重写路径：
    ```
    module.exports = {
      //...
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            pathRewrite: {'^/api' : ''}
          }
        }
      }
    };
    ```

- 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，修改配置如下：
    ```
    module.exports = {
      //...
      devServer: {
        proxy: {
          '/api': {
            target: 'https://other-server.example.com',
            secure: false
          }
        }
      }
    };
    ```

- 有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。  
  在函数中你可以访问请求体、响应体和代理选项。必须返回 false 或路径，来跳过代理请求。  
  例如：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。你可以这样做：
    ```
    module.exports = {
      //...
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            bypass: function(req, res, proxyOptions) {
              if (req.headers.accept.indexOf('html') !== -1) {
                console.log('Skipping proxy for browser request.');
                return '/index.html';
              }
            }
          }
        }
      }
    };
    ```
    
- 如果你想要代理多个路径特定到同一个 target 下，你可以使用由一个或多个「具有 context 属性的对象」构成的数组：
    ```
    module.exports = {
      //...
      devServer: {
        proxy: [{
          context: ['/auth', '/api'],
          target: 'http://localhost:3000',
        }]
      }
    };
    ```
    
- 注意，默认情况下，根请求不会被代理。要启用根代理，应该将 devServer.index 选项指定为 falsy 值：
    ```
    module.exports = {
      //...
      devServer: {
        index: '', // specify to enable root proxying
        host: '...',
        contentBase: '...',
        proxy: {
          context: () => true,
          target: 'http://localhost:1234'
        }
      }
    };
    ```   
 
#### 2. 跨域原理   
- 参数列表中有一个changeOrigin参数, 是一个布尔值, 设置为true, 本地就会虚拟一个服务器接收你的请求并代你发送该请求
    ```
    module.exports = {
        //...
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                }
            }
        }
    };
    ```
    
#### 3. 更多参数
    target：要使用url模块解析的url字符串
    forward：要使用url模块解析的url字符串
    agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
    ssl：要传递给https.createServer（）的对象
    ws：true / false，是否代理websockets
    xfwd：true / false，添加x-forward标头
    secure：true / false，是否验证SSL Certs
    toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
    prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
    ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
    localAddress：要为传出连接绑定的本地接口字符串
    changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
    

