### 1. devServe.Proxy
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
    

