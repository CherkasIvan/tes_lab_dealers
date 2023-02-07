import { ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ESystemException } from '@app/common/exceptions/enums';
import { ExceptionBody } from '@app/common/exceptions/exception-body.dto';
import { BackendException } from '@app/common/exceptions/backend.exception';

/**
 * Интерфейс исключения владации
 */
interface RequestValidationError {
    properties: string[];
    errors: { [key: string]: string };
    nested?: RequestValidationError[];
}

/**
 * Маппер ошибки
 * @param error
 */
function mapError(error: ValidationError): RequestValidationError {
    return {
        properties: [error.property],
        errors: error.constraints ?? {},
        nested: error.children?.map(mapError),
    };
}

/**
 * Класс ошибки валидации
 */
export class ValidationException extends BackendException {
    /**
     * Ошибки валидации
     */
    validationErrors: ValidationError[];
    constructor(errors: ValidationError[]) {
        super(ESystemException.ValidationError);
        this.validationErrors = errors;
    }

    getResponse(): ExceptionBody {
        return {
            details: this.validationErrors.map(mapError).reduce((acc, curr) => {
                const obj: { [key: string]: string[] } = {};
                const prop = curr.properties.pop();
                if (prop) {
                    obj[prop] = Object.keys(curr.errors).map((key) => curr.errors[key]);
                }
                return Object.assign(acc, obj);
            }, {}),
            code: this.error,
            message: this.message,
            status: this.getStatus(),
            description: this.description,
        };
    }

    @ApiProperty({
        example: {
            phone: ['must be phone', 'must start with +7'],
        },
    })
    errors: object = {};

    @ApiProperty({
        example: 'Ошибка валидации',
    })
    message = 'Ошибка валидации';

    @ApiProperty({
        example: 'system.ValidationException',
    })
    error = ESystemException.ValidationError;
}
