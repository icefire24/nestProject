import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class userGuard implements CanActivate {
  @Inject(Reflector)
  private reflect: Reflector;
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    try {
      const user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('token失效，请重新登录');
    }
  }
}
