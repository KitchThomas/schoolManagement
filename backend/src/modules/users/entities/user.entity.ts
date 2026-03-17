/**
 * 用户实体（用于 Swagger 文档）
 * School Management Application Backend
 * 
 * @description 定义用户实体结构（配合 Prisma 使用）
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户实体
 * 注意：实际数据库操作使用 Prisma Client
 * 这个文件主要用于 Swagger 文档生成
 */
export class User {
  @ApiProperty({
    description: '用户唯一标识符',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '用户邮箱（唯一）',
    example: 'user@school.com',
  })
  email: string;

  @ApiProperty({
    description: '密码哈希（不暴露给前端）',
    example: '***',
    writeOnly: true,
  })
  passwordHash: string;

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
    description: '最后登录时间',
    example: '2026-03-17T12:00:00.000Z',
    nullable: true,
  })
  lastLoginAt: Date | null;

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

  @ApiProperty({
    description: '软删除时间',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}
