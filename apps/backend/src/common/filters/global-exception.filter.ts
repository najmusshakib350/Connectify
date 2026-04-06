import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly config: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { id?: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let payload: Record<string, unknown> = {
      statusCode: status,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        payload = { statusCode: status, message: res };
      } else if (typeof res === 'object' && res !== null) {
        payload = { ...(res as Record<string, unknown>), statusCode: status };
      } else {
        payload = { statusCode: status, message: 'Error' };
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message);
      payload = {
        statusCode: status,
        message: 'Internal server error',
      };
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        payload.debug = exception.message;
      }
    } else {
      this.logger.error('Unknown exception', exception as never);
    }

    const body = {
      ...payload,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(request.id ? { requestId: request.id } : {}),
    };

    response.status(status).json(body);
  }
}
