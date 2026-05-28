import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const start = Date.now();
    const method = request.method;
    const url = request.originalUrl ?? request.url;

    this.logger.log(`[REQ] ${method} ${url} ip=${request.ip}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          this.logger.log(
            `[RES] ${method} ${url} status=${response.statusCode} duration=${duration}ms`,
          );
        },
        error: (error: unknown) => {
          const duration = Date.now() - start;
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.error(
            `[ERR] ${method} ${url} status=${response.statusCode} duration=${duration}ms error=${message}`,
          );
        },
      }),
    );
  }
}
