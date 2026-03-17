/**
 * 用户模块
 * School Management Application Backend
 * 
 * @description 配置用户管理相关的依赖和提供者
 * @author 大河 & Team
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
