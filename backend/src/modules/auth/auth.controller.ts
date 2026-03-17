/**
 * 认证控制器
 * School Management Application Backend
 * 
 * @description 处理认证相关的 HTTP 请求
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
} from './dto';
import { CurrentUser, UserInfo } from '../../common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   * POST /auth/register
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册', description: '创建新用户账户' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '注册成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '邮箱已被注册',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求数据验证失败',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registration request received for: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '使用邮箱和密码登录' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '凭据无效',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login request received for: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  /**
   * 刷新访问令牌
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '刷新令牌',
    description: '使用刷新令牌获取新的访问令牌',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '刷新令牌无效或已过期',
  })
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshResponseDto> {
    this.logger.log('Token refresh request received');
    
    // 使用刷新策略验证令牌
    // 注意：这里需要配合 JwtRefreshStrategy 使用
    // 简化处理：直接验证令牌并提取用户信息
    
    const jwtService = require('jsonwebtoken');
    const config = require('config');
    
    try {
      const payload = jwtService.verify(
        refreshTokenDto.refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production',
      );
      
      return this.authService.refreshTokens(payload.sub, payload.email);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * 用户登出
   * POST /auth/logout
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '用户登出',
    description: '登出当前用户（需要认证）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登出成功',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证',
  })
  async logout(@CurrentUser() user: UserInfo): Promise<LogoutResponseDto> {
    this.logger.log(`Logout request received for user: ${user.email}`);
    return this.authService.logout(user.id);
  }
}
