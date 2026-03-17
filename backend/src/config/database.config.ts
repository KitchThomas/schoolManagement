/**
 * 数据库配置
 * School Management Application Backend
 * 
 * @description 数据库连接和 Prisma 配置
 * @author 大河 & Team
 * @version 1.0.0
 */

import { registerAs } from '@nestjs/config';

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  url: string;
}

/**
 * 数据库配置工厂
 */
export default registerAs(
  'database',
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/school_management?schema=public',
  }),
);
