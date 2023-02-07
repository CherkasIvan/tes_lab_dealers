import { DynamicModule, Module } from '@nestjs/common';
import { AmqpProviderConfigInterface } from './amqp-provider-config.interface';
import { AMQP_CONNECTION_SERVICE_FACTORY } from '@app/drivers/amqp/amqp.factory';

@Module({})
export class AmqpDriverModule {
    static forRoot(providers: AmqpProviderConfigInterface[]): DynamicModule {
        /** Фабрика подключения к Mongo */
        const AMQP_PROVIDERS = providers.map(AMQP_CONNECTION_SERVICE_FACTORY);
        return {
            global: true,
            module: AmqpDriverModule,
            imports: [],
            providers: [...AMQP_PROVIDERS],
            exports: [...AMQP_PROVIDERS],
        };
    }
}
