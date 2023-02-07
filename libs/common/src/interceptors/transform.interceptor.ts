import { NestInterceptor, ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
        return next.handle().pipe(map((data) => instanceToPlain(data)));
    }
}
