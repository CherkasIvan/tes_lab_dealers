import * as winston from 'winston';
import { format } from 'winston';

/**
 * Функция-преобразователь для winston лога
 * Убирает internalPayloadString из лога
 */
export const removeInternalPayloadStringFormatter: winston.Logform.FormatWrap = format((info) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internalPayloadString, ...rest } = info;
    return rest;
});
