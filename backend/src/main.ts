/**
 * NestJS 应用入口文件
 * School Management Application Backend
 * 
 * @description 创建并配置 NestJS 应用实例
 * @author 大河 & Team
 * @version 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // 配置 CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离非装饰器属性
      forbidNonWhitelisted: true, // 如果有非白名单属性则抛出错误
      transform: true, // 自动转换负载为 DTO 实例
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
      disableErrorMessages: process.env.NODE_ENV === 'production', // 生产环境禁用详细错误
    }),
  );

  // 配置 Swagger API 文档
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('School Management API')
      .setDescription(
        'School Management Application Backend API Documentation\n\n' +
        '## 认证说明\n' +
        '大部分接口需要 JWT 认证，请在请求头中添加：\n' +
        '```\n' +
        'Authorization: Bearer <your_jwt_token>\n' +
        '```\n\n' +
        '## 权限说明\n' +
        '- 管理员 (ADMIN): 完全访问权限\n' +
        '- 教师 (TEACHER): 课程管理和学生评分权限\n' +
        '- 学生 (STUDENT): 学习和提交作业权限\n' +
        '- 家长 (PARENT): 查看子女学习进度权限',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '请输入 JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('auth', '认证相关接口 - 登录、注册、令牌刷新等')
      .addTag('users', '用户管理接口 - CRUD、角色管理、权限检查')
      .addTag('courses', '课程管理接口')
      .addTag('assignments', '作业管理接口')
      .addTag('submissions', '作业提交接口')
      .addTag('quizzes', '测验管理接口')
      .addTag('files', '文件管理接口')
      .addTag('notifications', '通知管理接口')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .information-container { padding: 20px 0; }
      `,
      customSiteTitle: 'School Management API Docs',
    });

    logger.log(`Swagger documentation available at: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/${process.env.API_PREFIX || 'api/v1'}`);
  logger.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
