/**
 * Roles 装饰器
 * School Management Application Backend
 * 
 * @description 声明访问接口所需的角色
 * @author 大河 & Team
 * @version 1.0.0
 */

import { SetMetadata } from '@nestjs/common';

/**
 * 角色元数据键
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles() 装饰器
 * 用于标记访问接口所需的角色
 * 
 * @example
 * @Roles('ADMIN', 'TEACHER')
 * @Get('admin-only')
 * adminOnlyRoute() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
