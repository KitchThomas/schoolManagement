/**
 * JWT 策略
 * School Management Application Backend
 * 
 * @description 验证和解析 JWT 访问令牌
 * @author 大河 & Team
 * @version 1.0.0
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * JWT 负载接口
 */
export interface JwtPayload {
  sub: string; // 用户ID
  email: string;
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}

/**
 * 验证后的用户信息
 */
export interface ValidatedUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * 验证 JWT 负载并返回用户信息
   * 这个方法会在 JWT 令牌验证通过后自动调用
   */
  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    this.logger.debug(`Validating JWT for user: ${payload.email}`);

    // 查询用户及其角色和权限
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(`User not found: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      this.logger.warn(`User account is not active: ${payload.sub}, status: ${user.status}`);
      throw new UnauthorizedException('User account is not active');
    }

    // 提取角色名称
    const roles = user.roles.map((userRole: any) => userRole.role.name);

    // 提取权限字符串（去重）
    const permissions: string[] = [
      ...new Set(
        user.roles.flatMap((userRole: any) =>
          userRole.role.permissions.map((rp: any) => `${rp.permission.resource}:${rp.permission.action}`),
        ),
      ),
    ];

    this.logger.debug(
      `User validated: ${user.email}, Roles: ${roles.join(', ')}, Permissions: ${permissions.length}`,
    );

    return {
      id: user.id,
      email: user.email,
      roles,
      permissions,
    };
  }
}
