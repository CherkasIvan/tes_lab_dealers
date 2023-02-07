/**
 * Формат лога для внутреннего логирования
 */
export interface InternalLogFormatInterface {
    /**
     * Метод, в котором вызвана запись
     * @example 'hello'
     */
    method?: string; // for http method + path
    /**
     * Полезная нагрузка лога
     * Произвольный объект, содержащий полезную информацию
     */
    internalPayload?: object; // business logic, code generated message
    /**
     * Полезная нагрузка, преобразованная к строке
     * Предназначено для возможности чтения полезной нагрузки лога в kibana
     */
    internalPayloadString: string;
    /**
     * Лог сообщение
     */
    message: string;
}
