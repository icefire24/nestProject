import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
//扩展SetMetadata装饰器，分组
export const aaa = (value: string) => {
  return SetMetadata('aaa', value);
};
//自定义query装饰器
export const myQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.query[data];
  },
);
//自定义方法装饰器
export const fnDec = (path, value) => {
  return applyDecorators(UseGuards(path), SetMetadata('aaa', value));
};
