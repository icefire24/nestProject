import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Userdto } from './dto/userdto';
import { userGuard } from 'src/aop/maxGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body(ValidationPipe) userdto: Userdto) {
    return this.userService.register(userdto);
  }
  @Post('login')
  login(@Body(ValidationPipe) userdto: Userdto) {
    return this.userService.login(userdto);
  }

  @Get('all')
  @UseGuards(userGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get('bbb')
  bbb() {
    console.log('bbb');
    return 'bbb';
  }
}
