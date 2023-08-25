import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  isNotEmpty,
  isString,
} from 'class-validator';

export class Userdto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  userName: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
