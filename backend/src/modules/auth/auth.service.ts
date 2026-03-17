/**
 * 认证服务
 * School Management Application Backend
 * 
 * @description 处理用户认证逻辑：注册、登录、令牌刷新、登出
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 用户注册
   * @param registerDto 注册信息
   * @returns 认证响应（包含令牌和用户信息）
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    this.logger.log(`Registration attempt for email: ${email}`);

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`Registration failed: Email already exists - ${email}`);
      throw new ConflictException('Email already registered');
    }

    // 加密密码
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 开始事务
    const result = await this.prisma.$transaction(async (tx) => {
      // 创建用户
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          status: 'ACTIVE',
        },
      });

      // 查找或创建默认学生角色
      let studentRole = await tx.role.findUnique({
        where: { name: 'STUDENT' },
      });

      if (!studentRole) {
        this.logger.log('Creating default STUDENT role');
        studentRole = await tx.role.create({
          data: {
            name: 'STUDENT',
            displayName: '学生',
            description: '默认学生角色',
            isSystem: true,
          },
        });
      }

      // 为用户分配角色
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: studentRole.id,
        },
      });

      return user;
    });

    this.logger.log(`User registered successfully: ${email}`);

    // 生成令牌
    const tokens = await this.generateTokens(result.id, result.email);

    // 返回认证响应
    return this.buildAuthResponse(result, tokens);
  }

  /**
   * 用户登录
   * @param loginDto 登录信息
   * @returns 认证响应（包含令牌和用户信息）
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt for email: ${email}`);

    // 查找用户（包含角色信息）
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(`Login failed: User not found - ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password - ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      this.logger.warn(`Login failed: Account is not active - ${email}`);
      throw new UnauthorizedException('Account is not active');
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`User logged in successfully: ${email}`);

    // 生成令牌
    const tokens = await this.generateTokens(user.id, user.email);

    // 返回认证响应
    return this.buildAuthResponse(user, tokens);
  }

  /**
   * 刷新访问令牌
   * @param userId 用户ID
   * @param email 用户邮箱
   * @returns 新的令牌
   */
  async refreshTokens(
    userId: string,
    email: string,
  ): Promise<RefreshResponseDto> {
    this.logger.log(`Refreshing tokens for user: ${email}`);

    // 验证用户是否存在且状态正常
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid user');
    }

    // 生成新的令牌
    const tokens = await this.generateTokens(userId, email);

    this.logger.log(`Tokens refreshed successfully for user: ${email}`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.parseTimeToSeconds(
        this.configService.get<string>('jwt.expiresIn') || '7d',
      ),
    };
  }

  /**
   * 用户登出
   * @param userId 用户ID
   * @returns 登出消息
   */
  async logout(userId: string): Promise<LogoutResponseDto> {
    this.logger.log(`User logging out: ${userId}`);

    // 注意：在生产环境中，应该将刷新令牌加入黑名单
    // 可以使用 Redis 存储黑名单，或者从数据库中删除刷新令牌

    return {
      message: 'Successfully logged out',
    };
  }

  /**
   * 生成访问令牌和刷新令牌
   */
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    // 生成访问令牌
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '7d',
    });

    // 生成刷新令牌
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '30d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * 构建认证响应
   */
  private async buildAuthResponse(
    user: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<AuthResponseDto> {
    // 获取用户角色
    const roles = user.roles?.map((ur: any) => ur.role.name) || [];

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.parseTimeToSeconds(
        this.configService.get<string>('jwt.expiresIn') || '7d',
      ),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        status: user.status,
        emailVerified: user.emailVerified,
        roles,
      },
    };
  }

  /**
   * 解析时间字符串为秒数
   * 例如: '7d' -> 604800, '30d' -> 2592000, '1h' -> 3600
   */
  private parseTimeToSeconds(timeString: string): number {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60;
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return parseInt(timeString);
    }
  }
}
