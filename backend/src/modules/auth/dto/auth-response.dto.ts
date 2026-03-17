/**
 * 认证响应 DTO
 * School Management Application Backend
 * 
 * @description 认证成功后的响应数据
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息响应
 */
export class UserResponseDto {
  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '邮箱',
    example: 'student@school.com',
  })
  email: string;

  @ApiProperty({
    description: '名字',
    example: '张',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: '姓氏',
    example: '三',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: '用户状态',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: '邮箱是否已验证',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: '用户角色列表',
    type: [String],
    example: ['STUDENT'],
  })
  roles: string[];
}

/**
 * 登录/注册成功响应
 */
export class AuthResponseDto {
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: '访问令牌过期时间（秒）',
    example: 604800,
  })
  expiresIn: number;

  @ApiProperty({
    description: '用户信息',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

/**
 * 刷新令牌响应
 */
export class RefreshResponseDto {
  @ApiProperty({
    description: '新的访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '新的刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: '访问令牌过期时间（秒）',
    example: 604800,
  })
  expiresIn: number;
}

/**
 * 登出响应
 */
export class LogoutResponseDto {
  @ApiProperty({
    description: '登出消息',
    example: 'Successfully logged out',
  })
  message: string;
}
