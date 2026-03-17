/**
 * Permissions 装饰器
 * School Management Application Backend
 * 
 * @description 声明访问接口所需的权限
 * @author 大河 & Team
 * @version 1.0.0
 */

import { SetMetadata } from '@nestjs/common';

/**
 * 权限元数据键
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * @Permissions() 装饰器
 * 用于标记访问接口所需的权限
 * 
 * @example
 * @Permissions('course:create', 'course:update')
 * @Post('courses')
 * createCourse() {}
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
