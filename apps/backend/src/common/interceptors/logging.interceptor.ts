import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FileLoggerService } from './file-logger.service';

const SENSITIVE_KEY =
  /password|repeatpassword|token|secret|authorization|cookie|apikey|api_key|creditcard|ssn|pin\b/i;

const MAX_PAYLOAD_CHARS = 16_384;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly fileLogger: FileLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { id?: string; body?: unknown }>();
    const res = http.getResponse<Response>();

    const startedAt = Date.now();
    const timestamp = new Date().toISOString();
    const method = req.method ?? 'UNKNOWN';
    const url = req.originalUrl ?? req.url ?? '';

    this.fileLogger.appendLine({
      type: 'request',
      timestamp,
      method,
      url,
      requestId: req.id,
      body: this.serializeForLog(req.body),
    });

    return next.handle().pipe(
      tap((data) => {
        const statusCode = res.statusCode;
        this.fileLogger.appendLine({
          type: 'response',
          timestamp: new Date().toISOString(),
          method,
          url,
          requestId: req.id,
          statusCode,
          durationMs: Date.now() - startedAt,
          data: this.serializeForLog(data),
        });
      }),
      catchError((err: unknown) => {
        const { statusCode, message, details } = this.normalizeError(err);
        this.fileLogger.appendLine({
          type: 'error',
          timestamp: new Date().toISOString(),
          method,
          url,
          requestId: req.id,
          statusCode,
          durationMs: Date.now() - startedAt,
          error: message,
          ...(details !== undefined
            ? { errorDetails: this.serializeForLog(details) }
            : {}),
        });
        return throwError(() => err);
      }),
    );
  }

  private normalizeError(err: unknown): {
    statusCode: number;
    message: string;
    details?: unknown;
  } {
    if (err instanceof HttpException) {
      const statusCode = err.getStatus();
      const response = err.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : err.message || 'HttpException';
      const details =
        typeof response === 'object' && response !== null
          ? response
          : undefined;
      return { statusCode, message, details };
    }
    if (err instanceof Error) {
      return {
        statusCode: 500,
        message: err.message,
        details: { name: err.name },
      };
    }
    return {
      statusCode: 500,
      message: 'Unknown error',
      details: String(err),
    };
  }

  private serializeForLog(value: unknown): unknown {
    const redacted = this.redactSensitive(value);
    try {
      const s = JSON.stringify(redacted);
      if (s.length > MAX_PAYLOAD_CHARS) {
        return `${s.slice(0, MAX_PAYLOAD_CHARS)}...[truncated]`;
      }
      return redacted;
    } catch {
      return '[Unserializable]';
    }
  }

  private redactSensitive(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.redactSensitive(item));
    }
    if (
      typeof value === 'object' &&
      Object.getPrototypeOf(value) === Object.prototype
    ) {
      const out: Record<string, unknown> = {};
      for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
        out[key] = SENSITIVE_KEY.test(key)
          ? '[REDACTED]'
          : this.redactSensitive(v);
      }
      return out;
    }
    return value;
  }
}
