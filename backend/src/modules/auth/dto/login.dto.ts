/**
 * 登录 DTO
 * School Management Application Backend
 * 
 * @description 用户登录请求验证
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'student@school.com',
  })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'Password123',
  })
  @IsString()
  password: string;
}
