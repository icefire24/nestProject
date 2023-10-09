import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Userdto } from './dto/userdto';
import { LoginGuard } from 'src/login.guard';

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
  @Get('refresh')
  refresh(@Query('refresh_token') refreshToken: string) {
    return this.userService.refresh(refreshToken);
  }
  @Get('all')
  @UseGuards(LoginGuard)
  findAll() {
    return this.userService.findAll();
  }
  @Get('aaa')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa';
  }
  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
