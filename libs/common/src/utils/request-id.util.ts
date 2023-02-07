import { createNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';

export const namespace = createNamespace('app');

/**
 * Метод получения id запроса из CLS
 */
export function getRequestId(): string | undefined {
    return namespace.get('requestId');
}

export function setRequestId(requestId: string): void {
    namespace.set('requestId', requestId);
}

/** middleware для добавления request-id в контекст выполнения */
export function requestIdMiddleware(request: Request, response: Response, next: NextFunction): void {
    namespace.bindEmitter(request);
    namespace.bindEmitter(response);
    namespace.run(() => {
        const headerRequestID = request.headers['x-request-id'];
        namespace.set('requestId', headerRequestID);

        next();
    });
}

export function runPromise<T>(fn: (...args: unknown[]) => Promise<T>) {
    return namespace.runPromise(fn);
}
