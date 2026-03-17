/**
 * 用户响应 DTO
 * School Management Application Backend
 * 
 * @description 用户信息响应格式
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 角色信息
 */
export class RoleInfoDto {
  @ApiProperty({
    description: '角色ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '角色名称',
    example: 'TEACHER',
  })
  name: string;

  @ApiProperty({
    description: '显示名称',
    example: '教师',
  })
  displayName: string;

  @ApiPropertyOptional({
    description: '角色描述',
    example: '教师角色，可以管理课程和评分',
  })
  description?: string;
}

/**
 * 用户基本信息
 */
export class UserDto {
  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '邮箱',
    example: 'teacher@school.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: '名字',
    example: '张',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: '姓氏',
    example: '三',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;

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

  @ApiPropertyOptional({
    description: '最后登录时间',
    example: '2026-03-17T12:00:00.000Z',
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: '创建时间',
    example: '2026-03-17T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2026-03-17T12:00:00.000Z',
  })
  updatedAt: Date;
}

/**
 * 用户详情（包含角色和权限）
 */
export class UserDetailDto extends UserDto {
  @ApiProperty({
    description: '用户角色列表',
    type: [RoleInfoDto],
  })
  roles: RoleInfoDto[];

  @ApiProperty({
    description: '用户权限列表',
    type: [String],
    example: ['course:create', 'course:update', 'assignment:grade'],
  })
  permissions: string[];
}

/**
 * 用户列表项（简化版）
 */
export class UserListItemDto extends UserDto {
  @ApiProperty({
    description: '用户角色名称列表',
    type: [String],
    example: ['TEACHER', 'STUDENT'],
  })
  roleNames: string[];
}

/**
 * 分页响应用户列表
 */
export class UserListResponseDto {
  @ApiProperty({
    description: '用户列表',
    type: [UserListItemDto],
  })
  items: UserListItemDto[];

  @ApiProperty({
    description: '总数',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  limit: number;
}
