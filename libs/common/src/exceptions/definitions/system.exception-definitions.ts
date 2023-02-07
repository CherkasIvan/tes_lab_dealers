import { HttpStatus } from '@nestjs/common';
import { ExceptionInterface } from '@app/common/exceptions';
import { ESystemException } from '@app/common/exceptions/enums';

/**
 * Системные исключения
 */
export const systemExceptionDefinitions: { [key in ESystemException]: ExceptionInterface } = {
    [ESystemException.Unknown]: {
        code: ESystemException.Unknown,
        message: 'Неизвестная системная ошибка',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    [ESystemException.ValidationError]: {
        code: ESystemException.ValidationError,
        message: 'Ошибка валидации',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
    },
    [ESystemException.NotImplemented]: {
        code: ESystemException.NotImplemented,
        message: 'Функционал не реализован',
        status: HttpStatus.NOT_IMPLEMENTED,
    },
    [ESystemException.AmqpError]: {
        code: ESystemException.AmqpError,
        message: 'Ошибка работы с Amqp',
        status: HttpStatus.BAD_GATEWAY,
    },
    [ESystemException.DatabaseError]: {
        code: ESystemException.DatabaseError,
        message: 'Ошибка работы с базой данных',
        status: HttpStatus.BAD_GATEWAY,
    },
};
