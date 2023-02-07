import { systemExceptionDefinitions } from '@app/common/exceptions/definitions';
import { ExceptionEnumType } from '@app/common/exceptions/exception-enum-type.type';
import { ExceptionInterface } from '@app/common/exceptions/exception.interface';

/**
 * Библиотека ошибок
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ExceptionLib: { [key in ExceptionEnumType]: ExceptionInterface } = {
    ...systemExceptionDefinitions,
};
