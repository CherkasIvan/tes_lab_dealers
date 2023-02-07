/**
 * Ошибка бэкэнда
 */
import { BaseException } from '@app/common/exceptions/base.exception';
import { ExceptionEnumType } from '@app/common/exceptions/exception-enum-type.type';
import { ExceptionLib } from '@app/common/exceptions/exceptions';
import { ESystemException } from '@app/common/exceptions/enums';
import { ExceptionBody } from '@app/common/exceptions/exception-body.dto';

export class BackendException extends BaseException {
    constructor(code: ExceptionEnumType, description?: string) {
        super(ExceptionLib[code].code, ExceptionLib[code].status);
        this.message = ExceptionLib[code].message;
        this.error = ExceptionLib[code].code;
        this.description = description;
    }

    /**
     * Ошибка
     */
    error: ExceptionEnumType = ESystemException.Unknown;

    /**
     * Сообщение
     */
    message = 'Unknown';

    description?: string;

    getResponse(): ExceptionBody {
        return {
            code: this.error,
            status: this.getStatus(),
            message: this.message,
            description: this.description,
        };
    }
}
