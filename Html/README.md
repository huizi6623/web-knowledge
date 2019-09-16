### 1. 事件循环
事件循环是指: 执行一个宏任务，然后执行清空微任务列表，循环再执行宏任务，再清微任务列表

微任务 microtask(jobs): promise.then / ajax / Object.observe(该方法已废弃) 
宏任务 macrotask(task): setTimeout / script / IO / UI Rendering

### 2. 从输入url到显示的过程