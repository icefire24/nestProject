### nest
Nest 基于 express 这种 http 平台做了一层封装，应用了 MVC、IOC、AOP 等架构思想。

MVC 就是 Model、View Controller 的划分，请求先经过 Controller，然后调用 Model 层的 Service、Repository 完成业务逻辑，最后返回对应的 View。

IOC 是指 Nest 会自动扫描带有 @Controller、@Injectable 装饰器的类，创建它们的对象，并根据依赖关系自动注入它依赖的对象，免去了手动创建和组装对象的麻烦。

AOP 则是把通用逻辑抽离出来，通过切面的方式添加到某个地方，可以复用和动态增删切面逻辑。

Nest 的 Middleware、Guard、Interceptor、Pipe、ExceptionFilter 都是 AOP 思想的实现，只不过是不同位置的切面，它们都可以灵活的作用在某个路由或者全部路由，这就是 AOP 的优势。

我们通过源码来看了它们的调用顺序，Middleware 是 Express 的概念，在最外层，到了某个路由之后，会先调用 Guard，Guard 用于判断路由有没有权限访问，然后会调用 Interceptor，对 Contoller 前后扩展一些逻辑，在到达目标 Controller 之前，还会调用 Pipe 来对参数做检验和转换。所有的 HttpException 的异常都会被 ExceptionFilter 处理，返回不同的响应。

Nest 就是通过这种 AOP 的架构方式，实现了松耦合、易于维护和扩展的架构。
### 安装 nestjs

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

那 --config 是指定 nest cli 的配置文件

### 数据传输

dto 是 data transfer object，就是用于封装传输的数据的对象

### 生命周期

首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。

全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法

然后监听网络端口。

之后 Nest 应用就正常运行了。

```
@controller()
class AppController implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
  onApplicationBootstrap() {
    console.log(`The application has been initialized.`);
  }
}

```

销毁
先调用每个模块的 controller、provider 的 onModuleDestroy 方法，然后调用 Module 的 onModuleDestroy 方法。

之后再调用每个模块的 controller、provider 的 beforeApplicationShutdown 方法，然后调用 Module 的 beforeApplicationShutdown 方法。

然后停止监听网络端口。

之后调用每个模块的 controller、provider 的 onApplicationShutdown 方法，然后调用 Module 的 onApplicationShutdown 方法。

之后停止进程。

### AOP

AOP 是 Aspect Oriented Programming 的缩写，意思是面向切面编程，是一种编程范式，它的核心思想是将与业务无关的功能抽离出来，比如日志、监控、缓存、权限等，然后通过动态代理的方式注入到业务中，这样就可以在不改变业务代码的情况下，实现这些功能。
Nest 实现 AOP 的方式更多，一共有五种，包括 Middleware、Guard、Pipe、Interceptor、ExceptionFilter：、
**Middleware** 全局中间件、路由中间件
### Guard 
守卫 用于在调用某个 Controller 之前判断权限，返回 true 或者 false 来决定是否放行：
```
创建守卫
@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
通过 @Injectable 装饰器加到 IOC 容器中，然后就可以在某个 Controller 启用了
@UseGuards(AuthGuard)
@Controller()
class AppController {}
全局启用
app.useGlobalGuards(new AuthGuard());
```
![image](/assets/aop.png)

### interceptor 拦截器
拦截器是在调用某个 Controller 之前，对请求和响应进行处理的，它可以对请求和响应进行修改，也可以抛出异常来终止请求。
```
@Injectable()
export class LoginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;
    if (username !== 'shun' || password !== '123456') {
      throw new HttpException('用户名或密码错误', HttpStatus.FORBIDDEN);
    }
    return next.handle();
  }
}
使用
@UseInterceptors(LoginInterceptor)
@Controller()
class AppController {}
全局使用
app.useGlobalInterceptors(new LoginInterceptor());
```
### pipe 管道
管道是用来验证数据的，它可以对数据进行转换，也可以抛出异常来终止请求。
内置的有 9 个 Pipe，从名字就能看出它们的意思：

ValidationPipe
ParseIntPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
DefaultValuePipe
ParseEnumPipe
ParseFloatPipe
ParseFilePipe
```
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
  }
}
使用
@UsePipes(new ValidationPipe())
@Controller()
class AppController {
    @Get()
    get(@Query('aaa',pipe) query: any) {
        return query
    }
}
全局使用
app.useGlobalPipes(new ValidationPipe());
```
### ExceptionFilter 异常过滤器
异常过滤器是用来处理异常的，它可以对异常进行转换，也可以抛出异常来终止请求。
```
@Catch(HttpException)
class HttpExecption implments ExceptionFilter{
    catch(exception:HttpException,host:ArgumentsHost){

    }
}
使用
@UseFilters(new HttpExecption())
@Controller()
class AppController {}
全局使用
app.useGlobalFilters(new HttpExecption());
```
### provider 注入

全局注入 module 模块注入 controller 构造器传入 service 服务注入
简写 providers: [PersonService]
除了指定 class 外，还可以直接指定一个值，让 IOC 容器来注入
useClass 的方式由 IOC 容器负责实例化，我们也可以用 useValue、useFactory 直接指定对象。useFactor 支持异步
useExisting 来指定别名
完整写法 providers: [{ provide: PersonService, useClass: PersonService,useValue?: {name:'shun',age:18},async useFactor?(){
await new Promise((resolve,reject)=>{
setTimeout(()=>{
resolve()
},1000)
})
return {name:'shun',age:18}
} }]

```
class personService {
  constructor( private readonly personService:personService) {}
}
```

属性注入

```
class PersonController {
  @Inject(PersonService)
    private readonly personService: PersonService;

}
```

### 上传文件

```
@Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: './uploads',
    }),
  ) //使用multer中间件
  uploadFile(
    @Body() CreatePersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>, //
  ) {
    return `json: ${JSON.stringify(CreatePersonDto)} `;
  }
```

### 静态文件

```
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });
  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}
bootstrap();
```

###
