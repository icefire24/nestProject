import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  @InjectEntityManager()
  private manage: EntityManager;

  create(createPersonDto: CreatePersonDto) {
    this.manage.save(Person, createPersonDto);
  }

  findAll() {
    return this.manage.find(Person);
  }

  findOne(id: number) {
    return this.manage.findOne(Person, {
      where: {
        id,
      },
    });
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return this.manage.save(Person, {
      id,
      ...updatePersonDto,
    });
  }

  remove(id: number) {
    return this.manage.delete(Person, id);
  }
}
