import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Inject,
  OnModuleInit,
  OnApplicationBootstrap,
  UseFilters,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { TestService } from './../test/test.service';
import { testException } from 'src/aop/httpException';
import { MaxGuard } from 'src/aop/maxGuard';

@Controller('person')
export class PersonController {
  // constructor(private readonly personService: PersonService) {}

  @Inject('personService')
  private readonly personService: PersonService;
  @Inject(TestService)
  private readonly testService: TestService;
  // onModuleInit() {
  //   console.log('onModuleInit, PersonController');
  // }
  // onApplicationBootstrap() {
  //   console.log('onApplicationBootstrap, PersonController');
  // }

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
  @Post('add')
  create(@Body() createPersonDto: CreatePersonDto) {
    console.log('createPersonDto: ', createPersonDto);
    return this.personService.create(createPersonDto);
  }
  @UseFilters(new testException())
  @Get('test')
  findAll() {
    throw new HttpException('Forbidden', 403);
  }
  @UseGuards(MaxGuard)
  @Get('find')
  findOne(@Query('id') id: number) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
