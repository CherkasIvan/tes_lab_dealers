import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { catchError, tap } from 'rxjs/operators';
import { InternalLogger } from '../logger';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

export interface RequestLogInterceptorOptions {
    disableRequestLog?: boolean;
}

/**
 * Interceptor ля перехвата входящих http запросов.
 */
@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
    private readonly logger = new InternalLogger(RequestLogInterceptor.name);

    /**
     * Создает interceptor, логирующий запросы к серверу
     * @param options
     */
    constructor(private readonly options: RequestLogInterceptorOptions) {}

    /**
     * Метод для перехвата запроса
     * @param context - контекст исполнения
     * @param next
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const shouldSkip = isRabbitContext(context) || this.options.disableRequestLog;
        if (shouldSkip) {
            return next.handle();
        }
        const now = new Date();

        const request = context.switchToHttp().getRequest();

        this.logRequest(request);

        return next.handle().pipe(
            tap((data) => {
                const response = context.switchToHttp().getResponse<Response>();
                this.logResponse(request, response, now, data);
            }),
            catchError((err: Error) => {
                const response = context.switchToHttp().getResponse();
                this.logResponseError(request, response, err, now);
                throw err;
            }),
        );
    }

    private logRequest(request: Request): void {
        const logMessage = `HTTP:request ${request.method} ${request.route.path}`;
        this.logger.log(logMessage);
        this.logger.debug({
            message: logMessage,
            internalPayload: {
                body: request.body,
                params: request.params,
                query: request.query,
                headers: request.headers,
            },
        });
    }

    private logResponse(request: Request, response: Response, requestStartDate: Date, responseData: unknown): void {
        const diff = this.calculateDiffTime(requestStartDate.toISOString());
        const internalPayload = {
            status: response.statusCode,
            statusText: response.statusMessage,
            responseTime: diff,
        };
        const logMessage = `HTTP:response:${response.statusCode}: ${request.method} ${request.route.path} in ${diff}ms`;
        this.logger.log({
            message: logMessage,
            internalPayload,
        });
        const logResponsePayload = false;
        if (logResponsePayload) {
            this.logger.debug({
                message: logMessage,
                internalPayload: {
                    ...internalPayload,
                    data: responseData,
                },
            });
        }
    }

    private logResponseError(request: Request, response: Response, error: Error, requestStartDate: Date): void {
        const diff = this.calculateDiffTime(requestStartDate.toISOString());
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const internalPayload = {
            message: error.message,
            status,
            statusText: response.statusMessage,
            responseTime: diff,
            responseData: error instanceof HttpException ? error.getResponse() : undefined,
        };

        const logMessage = `HTTP:error:${error.message}:${status}: ${request.method} ${request.route.path} in ${diff}ms`;

        this.logger.warn({
            message: logMessage,
            internalPayload,
        });
    }

    /**
     * Расчет времени выполнения
     * @param start - Время начала
     * @static
     * @private
     */
    private calculateDiffTime(start: string): number {
        const endTime = Date.now();
        const startTime = new Date(start).getTime();

        return endTime - startTime;
    }
}
