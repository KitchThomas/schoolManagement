/**
 * JWT 刷新策略
 * School Management Application Backend
 * 
 * @description 验证和解析 JWT 刷新令牌
 * @author 大河 & Team
 * @version 1.0.0
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * JWT 刷新负载接口
 */
export interface JwtRefreshPayload {
  sub: string; // 用户ID
  email: string;
  refreshToken: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const refreshSecret = configService.get<string>('jwt.refreshSecret');
    
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      passReqToCallback: true,
      secretOrKey: refreshSecret,
    });
  }

  /**
   * 验证刷新令牌
   */
  async validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): Promise<{ id: string; email: string; refreshToken: string }> {
    this.logger.debug(`Validating refresh token for user: ${payload.email}`);

    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // 验证用户是否存在且状态正常
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      this.logger.warn(`User not found for refresh token: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      this.logger.warn(`User account is not active: ${payload.sub}`);
      throw new UnauthorizedException('User account is not active');
    }

    // 注意：在生产环境中，应该将刷新令牌存储在数据库或 Redis 中
    // 并在这里验证令牌是否在有效列表中（实现令牌撤销功能）
    // 这里简化处理，仅验证 JWT 签名和用户状态

    return {
      id: user.id,
      email: user.email,
      refreshToken,
    };
  }
}
