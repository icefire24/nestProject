import { EntityManager } from 'typeorm';
import { HttpException, Inject, Injectable, UseGuards } from '@nestjs/common';
import { Userdto } from './dto/userdto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { userGuard } from 'src/aop/maxGuard';
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
      console.log(error);
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
    const token = this.jwtService.signAsync({
      user: {
        id: user.id,
        userName: user.userName,
      },
    });
    return token;
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
