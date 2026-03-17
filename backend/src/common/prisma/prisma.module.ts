/**
 * Prisma 模块
 * School Management Application Backend
 * 
 * @description 封装 Prisma Client，提供全局数据库访问
 * @author 大河 & Team
 * @version 1.0.0
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
