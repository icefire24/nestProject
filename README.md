### 安装nestjs
```
npm i -g @nestjs/cli
```
### 创建项目
```
nest new project-name
```
### 脚手架常用命令
```
nest g module module-name # 创建模块
nest g controller controller-name # 创建控制器
nest g service service-name # 创建服务
nest g class class-name # 创建类
nest g interface interface-name # 创建接口
nest g pipe pipe-name # 创建管道
nest g guard guard-name # 创建守卫
nest g filter filter-name # 创建过滤器
nest g gateway gateway-name # 创建网关
nest g middleware middleware-name # 创建中间件
nest g decorator decorator-name # 创建装饰器
nest g library library-name # 创建库
nest g resolver resolver-name # 创建解析器
nest g resource resource-name # 创建资源
```
参数

```
--flat 和 --no-flat 是指定是否生成对应目录的：true 生成对应目录，false 不生成对应目录\
--spec 和 --no-spec 是指定是否生成测试文件：
--skip-import 是指定不在 AppModule 里引入：
 --project，这是指定生成代码在哪个子项目的，等之后用到 monorepo 项目

 ```
### 启动项目
nest start
--watch 是监听文件变动，自动重启的。
--debug 是开启调试模式，
--exec 可以指定用什么来跑，默认是用 node 跑，你也可以切换别的 runtime

### 打包项目

 nest build
 --wepback 和 --tsc 是指定用什么编译，默认是 tsc 编译，也可以切换成 webpack。
 --watch 是监听文件变动，自动 build 的。

但是 --watch 默认只是监听 ts、js 文件，加上 --watchAssets 会连别的文件一同监听变化，并输出到 dist 目录，比如 md、yml 等文件。

--path 是指定 tsc 配置文件的路径的。

那 --config 是指定nest cli 的配置文件

