/**
 * Permissions 守卫
 * School Management Application Backend
 * 
 * @description 检查用户是否具有所需权限
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
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserInfo } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取所需权限
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置权限要求，允许访问
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserInfo;

    if (!user) {
      this.logger.warn('No user found in request');
      throw new ForbiddenException('Access denied. User not authenticated.');
    }

    // 检查用户是否具有所需权限中的所有权限
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !user.permissions?.includes(permission),
      );

      this.logger.warn(
        `User ${user.email} lacks required permissions: ${missingPermissions.join(', ')}`,
      );

      throw new ForbiddenException(
        `Access denied. Missing permissions: ${missingPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
