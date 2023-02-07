import { CallHandler, ExecutionContext, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SuccessResponse, SuccessResponseType } from '@mobility/apps-dto';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> | Promise<Observable<unknown>> {
        return next.handle().pipe(
            map((data): SuccessResponseType | typeof data => {
                if (data instanceof StreamableFile) {
                    return data;
                }
                return new SuccessResponse(data);
            }),
        );
    }
}
