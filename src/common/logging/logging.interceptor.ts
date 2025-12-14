import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, query, body } = request;

    const requestLog = {
      method,
      url,
      query: Object.keys(query).length > 0 ? query : undefined,
      body: Object.keys(body || {}).length > 0 ? body : undefined,
    };
    this.loggingService.log(`Incoming request: ${method} ${url}`, requestLog);

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          this.loggingService.log(
            `Outgoing response: ${method} ${url} - ${statusCode} (${duration}ms)`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode || 500;
          this.loggingService.error(
            `Outgoing response: ${method} ${url} - ${statusCode} (${duration}ms)`,
            error,
          );
        },
      }),
    );
  }
}
