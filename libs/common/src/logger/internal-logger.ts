import { Logger, LoggerService } from '@nestjs/common';
import { InternalLogFormatInterface } from './internal-log-format.interface';

type LogFormat = Pick<InternalLogFormatInterface, 'internalPayload' | 'message' | 'method'>;

/**
 * Класс обертка над {@link Logger } классом, позволяющий добавить тайпинги к лог функциям
 */
export class InternalLogger implements LoggerService {
    /**
     * nest logger, через которого будет выполняться запись
     * @private
     */
    private readonly _logger: Logger;

    /**
     * Создает внутренний логер
     * Класс является оберткой над Nest {@link Logger}, чтобы предоставить более удобный формат записи логов
     * @param contextName - название логирующего сервиса
     */
    constructor(private readonly contextName?: string) {
        this._logger = new Logger(contextName || InternalLogger.name);
    }

    /**
     * Выполнение записи debug лога
     * @param message - лог сообщение
     * @param context - контекст лога. Для подробностей смотри winston
     */
    debug(message: LogFormat | string, context?: string) {
        if (typeof message === 'string') {
            this._logger.debug(message, context);
            return;
        }
        this._logger.debug(this._buildLogObject(message), context || this.contextName);
    }

    /**
     * Выполнение записи error лога
     * @param message - лог сообщение. Либо исключение, либо сообщение по формату
     * @param trace - трейс ошибки
     * @param context - контекст лога. Для подробностей смотри winston
     */
    error(message: LogFormat | Error | string, trace?: string, context?: string) {
        if (message instanceof Error) {
            this._logger.error(
                this._buildLogObject({ message: message.message, internalPayload: message }),
                trace ?? message.stack,
                context || this.contextName,
            );
            return;
        }
        if (typeof message === 'string') {
            this._logger.error(message, trace, context || this.contextName);
            return;
        }
        this._logger.error(this._buildLogObject(message), trace, context || this.contextName);
    }

    /**
     * Выполнение записи info лога
     * @param message - лог сообщение
     * @param context - контекст лога. Для подробностей смотри winston
     */
    log(message: LogFormat | string, context?: string) {
        if (typeof message === 'string') {
            this._logger.log(message, context || this.contextName);
            return;
        }
        this._logger.log(this._buildLogObject(message), context || this.contextName);
    }

    /**
     * Выполнение записи verbose лога
     * @param message - лог сообщение
     * @param context - контекст лога. Для подробностей смотри winston
     */
    verbose(message: LogFormat | string, context?: string) {
        if (typeof message === 'string') {
            this._logger.verbose(message, context || this.contextName);
            return;
        }
        this._logger.verbose(this._buildLogObject(message), context || this.contextName);
    }

    /**
     * Выполнение записи warn лога
     * @param message - лог сообщение
     * @param context - контекст лога. Для подробностей смотри winston
     */
    warn(message: LogFormat | string, context?: string) {
        if (typeof message === 'string') {
            this._logger.warn(message, context || this.contextName);
            return;
        }
        this._logger.warn(this._buildLogObject(message), context || this.contextName);
    }

    /**
     * Метод для создания лога в формате {@link InternalLogFormatInterface}
     * @param message - объект лога для записи
     * @private
     */
    private _buildLogObject(message: LogFormat): InternalLogFormatInterface {
        return {
            ...message,
            internalPayloadString: JSON.stringify(message.internalPayload),
        };
    }
}
