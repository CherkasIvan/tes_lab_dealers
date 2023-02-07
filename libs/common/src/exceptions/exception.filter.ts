import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import * as ErrorStackParser from 'error-stack-parser';
import { ConfigService } from '@nestjs/config';
import { ErrorResponseType } from '@mobility/apps-dto';
import { getRequestId, InternalLogger } from '@app/common';
import { ExceptionBody } from '@app/common/exceptions/exception-body.dto';
import { BackendException } from '@app/common/exceptions/backend.exception';
import { ESystemException } from '@app/common/exceptions/enums';

/**
 * Фильтр исключений
 */
@Catch()
export class MainExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    private readonly logger = new InternalLogger(MainExceptionFilter.name);
    catch(exception: BackendException | Error, host: ArgumentsHost): void {
        const isDebug = this.configService.get('DEBUG') === 'on';

        // Если пришло nest HttpException, оно пробрасывается как есть и не преобразуется в 500-ю
        // Например, такое может произойти при раздаче статики
        if (exception instanceof HttpException && !(exception instanceof BackendException)) {
            this.logger.warn((exception as HttpException).message);
            host.switchToHttp()
                .getResponse<Response>()
                .status((exception as HttpException).getStatus())
                .json((exception as HttpException).getResponse());
            return;
        }

        const wrappedError =
            exception instanceof BackendException ? exception : new BackendException(ESystemException.Unknown, exception.message);

        if (wrappedError.getStatus() >= 500) {
            this.logger.error(exception, exception.stack);
        }

        if (process.env.DEBUG === 'on' && wrappedError.description) {
            this.logger.warn(wrappedError.description);
        }

        const response: ExceptionBody = wrappedError.getResponse();

        const requestId = getRequestId() || null;
        let stack = undefined;

        if (isDebug) {
            stack = exception instanceof BackendException ? ErrorStackParser.parse(wrappedError) : ErrorStackParser.parse(exception);
        }

        host.switchToHttp()
            .getResponse<Response>()
            .status(wrappedError.getStatus())
            .json({
                data: null,
                meta: {
                    ...wrappedError.getResponse(),
                    requestId,
                    success: false,
                    stack,
                },
            } as ErrorResponseType);
    }
}
