import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.token;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const data = this.jwtService.verify(authorization);
      return true;
    } catch (error) {
      throw new UnauthorizedException('token失效,请重新登陆');
    }
  }
}
