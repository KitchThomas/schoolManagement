/**
 * 日志拦截器
 * School Management Application Backend
 * 
 * @description 记录请求和响应日志
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    // 记录请求日志
    this.logger.log(
      `→ ${method} ${url} | Query: ${JSON.stringify(query)} | Params: ${JSON.stringify(params)}`,
    );

    // 开发环境下记录请求体
    if (process.env.NODE_ENV === 'development' && Object.keys(body || {}).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `← ${method} ${url} | Status: ${response.statusCode} | Duration: ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `✗ ${method} ${url} | Error: ${error.message} | Duration: ${duration}ms`,
        );
        throw error;
      }),
    );
  }
}
