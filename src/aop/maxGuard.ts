import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class MaxGuard implements CanActivate {
  @Inject(Reflector)
  private reflect: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.query.id);
    console.log(this.reflect.get('aaa', context.getHandler()));
    if (request.query.id > 10) {
      return false;
    } else {
      return true;
    }
  }
}
