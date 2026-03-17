/**
 * 创建用户 DTO
 * School Management Application Backend
 * 
 * @description 管理员创建用户的请求验证
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'teacher@school.com',
  })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '密码（至少8位，包含大小写字母和数字）',
    example: 'Password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: '密码至少需要8个字符' })
  @MaxLength(50, { message: '密码不能超过50个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    {
      message: '密码必须包含大小写字母和数字',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description: '名字',
    example: '李',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    description: '姓氏',
    example: '四',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({
    description: '用户状态',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: string;

  @ApiPropertyOptional({
    description: '要分配的角色ID列表',
    type: [String],
    example: ['role-id-1', 'role-id-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];
}
