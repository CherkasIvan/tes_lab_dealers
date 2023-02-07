import { HttpStatus } from '@nestjs/common';

/**
 * Тело исключения
 */
export interface ExceptionBody {
    /**
     * Код
     */
    code: string;
    message: string;
    status?: HttpStatus;
    description?: string;
    details?: object;
}
