import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Inject,
  ParseIntPipe,
  Session,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Reflector } from '@nestjs/core';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Inject(Reflector)
  private readonly reflect: Reflector;
  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }
  @Get('find')
  findAll() {
    return this.testService.findAll();
  }
  @Get('sss')
  sss(@Session() session) {
    console.log(session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
