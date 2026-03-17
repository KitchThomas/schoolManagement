/**
 * 应用配置
 * School Management Application Backend
 * 
 * @description 定义和导出应用配置
 * @author 大河 & Team
 * @version 1.0.0
 */

import { registerAs } from '@nestjs/config';

/**
 * 应用配置接口
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  frontendUrl: string;
  logLevel: string;
}

/**
 * 应用配置工厂
 * 使用 registerAs 确保类型安全
 */
export default registerAs(
  'app',
  (): AppConfig => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    logLevel: process.env.LOG_LEVEL || 'info',
  }),
);
