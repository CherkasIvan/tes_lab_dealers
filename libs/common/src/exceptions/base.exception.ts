import { HttpException } from '@nestjs/common';
import { ExceptionBody } from './exception-body.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Базовая ошибка
 */
export class BaseException extends HttpException {
    getResponse(): ExceptionBody | string | object {
        return super.getResponse();
    }

    /**
     * Ошибка
     */
    @ApiProperty({
        example: 'Описание ошибки',
    })
    message = 'Base exception';

    /**
     * Сообщение
     */
    @ApiProperty({
        example: 'code.Detail',
    })
    error = 'error.Default';
}
