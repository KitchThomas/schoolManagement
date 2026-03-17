/**
 * JWT 配置
 * School Management Application Backend
 * 
 * @description JWT 认证相关配置
 * @author 大河 & Team
 * @version 1.0.0
 */

import { registerAs } from '@nestjs/config';

/**
 * JWT 配置接口
 */
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

/**
 * JWT 配置工厂
 */
export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  }),
);
