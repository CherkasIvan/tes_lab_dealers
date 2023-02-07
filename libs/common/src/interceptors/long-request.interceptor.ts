import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Формирует WARNING в логах при запросах блиннее 1500 мс
 */
@Injectable()
export class LongRequestInterceptor implements NestInterceptor {
    /** логгер */
    logger = new Logger(LongRequestInterceptor.name);

    /**
     * Обработчик
     * @param context  ExecutionContext
     * @param next CallHandler
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const now = Date.now();
        return next.handle().pipe(
            tap(() => {
                const requestTime = Date.now() - now;
                if (requestTime > 1500) {
                    this.logger.warn(`Long request: ${context.switchToHttp().getRequest().path} at ${requestTime}ms`);
                }
            }),
        );
    }
}
