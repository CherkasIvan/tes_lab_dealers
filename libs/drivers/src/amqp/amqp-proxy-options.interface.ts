import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export interface AmqpProxyOptionsInterface extends RabbitMQConfig {
    /** Общий переключатель записи лога */
    enableLogs?: boolean;
    /** Выводить переданные данные. Пишет отдельный debug лог */
    logPayload?: boolean;
}
