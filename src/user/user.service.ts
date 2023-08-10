import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  @InjectEntityManager()
  private manage: EntityManager;

  create(createUserDto: CreateUserDto) {
    this.manage.save(User, createUserDto);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.manage.save(User, {
      id,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return this.manage.delete(User, id);
  }
}
