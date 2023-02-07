import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpProxyOptionsInterface } from '@app/drivers/amqp/amqp-proxy-options.interface';
import { AmqpProxy } from '@app/drivers/amqp/amqp-proxy';
import { AmqpProviderConfigInterface } from '@app/drivers/amqp/amqp-provider-config.interface';

export const AMQP_CONNECTION_SERVICE_FACTORY = (config: AmqpProviderConfigInterface): Provider => ({
    provide: config.injectToken,
    useFactory: async (configService: ConfigService) => {
        const amqpConfig = configService.get<AmqpProxyOptionsInterface>(config.configIdent);
        if (!amqpConfig) {
            throw new Error('amqpConfig is undefined');
        }

        const amqpConnection = new AmqpProxy(amqpConfig);
        Logger.verbose('AMQP Init...', AmqpConnection.name);
        await amqpConnection.init().catch((error) => {
            Logger.error('connection fail', error, 'RABBIT MQ Connection factory');
        });

        Logger.verbose('AMQP Init done.', AmqpConnection.name);
        return amqpConnection;
    },
    inject: [ConfigService],
});
