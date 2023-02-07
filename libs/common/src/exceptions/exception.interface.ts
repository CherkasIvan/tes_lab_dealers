import { HttpStatus } from '@nestjs/common';
import { ExceptionEnumType } from '@app/common/exceptions/exception-enum-type.type';

/**
 * Интерфейс исключения
 */
export interface ExceptionInterface {
    code: ExceptionEnumType;
    message: string;
    status: HttpStatus;
}
