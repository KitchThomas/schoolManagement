/**
 * Current User 装饰器
 * School Management Application Backend
 * 
 * @description 从请求中提取当前用户信息
 * @author 大河 & Team
 * @version 1.0.0
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

/**
 * @CurrentUser() 装饰器
 * 
 * @example
 * // 获取完整用户信息
 * @CurrentUser() user: UserInfo
 * 
 * // 获取特定字段
 * @CurrentUser('id') userId: string
 * @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserInfo | undefined, ctx: ExecutionContext): UserInfo | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserInfo;

    if (!user) {
      return null;
    }

    // 如果指定了字段，返回该字段的值
    if (data) {
      return user[data];
    }

    // 否则返回完整用户信息
    return user;
  },
);
