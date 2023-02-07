import { RabbitMQConfig, RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigService, registerAs } from '@nestjs/config';
import { AmqpProxyOptionsInterface } from '@app/drivers/amqp/amqp-proxy-options.interface';
import { DEALERS_EXCHANGE, VEHICLES_EVENT_EXCHANGE } from '@mobility/amqp-contracts';

const AMQP_CONFIG_EXCHANGES: RabbitMQExchangeConfig[] = [
    VEHICLES_EVENT_EXCHANGE,
    DEALERS_EXCHANGE,
];

type AmqpOptions = Pick<AmqpProxyOptionsInterface, Exclude<keyof AmqpProxyOptionsInterface, keyof RabbitMQConfig>>;

export const _amqpConfig = (configIdent: string, env: string, options: AmqpOptions | null = null) =>
    registerAs(configIdent, (): RabbitMQConfig => {
        const configService = new ConfigService();
        const connectionString = configService.get<string>(env);
        if (!connectionString) {
            throw new Error(`ENV: '${env}' not found. Check '.env' file or server variables.`);
        }
        return {
            ...options,
            uri: connectionString.split(','),
            exchanges: AMQP_CONFIG_EXCHANGES,
            connectionInitOptions: { wait: false },
            connectionManagerOptions: {
                heartbeatIntervalInSeconds: 15,
                reconnectTimeInSeconds: 30,
            },
        };
    });
