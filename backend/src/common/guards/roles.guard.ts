/**
 * Roles 守卫
 * School Management Application Backend
 * 
 * @description 检查用户是否具有所需角色
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserInfo } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取所需角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserInfo;

    if (!user) {
      this.logger.warn('No user found in request');
      throw new ForbiddenException('Access denied. User not authenticated.');
    }

    // 检查用户是否具有所需角色中的任意一个
    const hasRole = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );

    if (!hasRole) {
      this.logger.warn(
        `User ${user.email} lacks required roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
