import { EntityManager } from 'typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Userdto } from './dto/userdto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
const md5 = (password) => {
  const hash = crypto.createHash('md5');
  hash.update(password);
  return hash.digest('hex');
};
@Injectable()
export class UserService {
  @InjectEntityManager()
  private manage: EntityManager;
  @Inject(JwtService)
  private jwtService: JwtService;
  async register(Userdto: Userdto) {
    const user = await this.manage.findOneBy(User, {
      userName: Userdto.userName,
    });
    if (user) {
      throw new HttpException('用户名已存在', 201);
    }
    const newUser = new User();
    newUser.userName = Userdto.userName;
    newUser.password = md5(Userdto.password);
    try {
      this.manage.save(User, newUser);
      return '注册成功';
    } catch (error) {
      return '注册失败';
    }
  }
  async login(Userdto: Userdto) {
    const user = await this.manage.findOneBy(User, {
      userName: Userdto.userName,
    });
    if (!user) {
      throw new HttpException('用户名不存在', 202);
    }
    if (user.password !== md5(Userdto.password)) {
      throw new HttpException('密码错误', 203);
    }
    // 生成jwt token
    const token = this.jwtService.sign(
      {
        user: {
          id: user.id,
          userName: user.userName,
        },
      },
      {
        expiresIn: '1h',
      },
    );

    //生成refresh token
    const refreshToken = this.jwtService.sign(
      {
        userName: user.userName,
      },
      {
        expiresIn: '7d',
      },
    );
    return { token, refreshToken };
  }
  async refresh(refresh_token: string) {
    try {
      const data = this.jwtService.verify(refresh_token);
      const user = await this.manage.findOneBy(User, {
        userName: data.userName,
      });
      // 生成jwt token
      const token = this.jwtService.sign(
        {
          user: {
            id: user.id,
            userName: user.userName,
          },
        },
        {
          expiresIn: '1h',
        },
      );

      //生成refresh token
      const refreshToken = this.jwtService.sign(
        {
          userName: user.userName,
        },
        {
          expiresIn: '7d',
        },
      );
      return { token, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('token过期，请重新登陆');
    }
  }
  findAll() {
    return this.manage.find(User);
  }

  findOne(id: number) {
    return this.manage.findOne(User, {
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.manage.delete(User, id);
  }
}
