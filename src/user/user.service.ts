import { EntityManager } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Userdto } from './dto/userdto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  @InjectEntityManager()
  private manage: EntityManager;

  async register(Userdto: Userdto) {
    const user = await this.manage.findOneBy(User, {
      userName: Userdto.userName,
    });
    if (user) {
      throw new HttpException('用户名已存在', 201);
    }
    try {
      this.manage.save(User, Userdto);
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
    if (user.password !== Userdto.password) {
      throw new HttpException('密码错误', 203);
    }
    return '登录成功';
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
