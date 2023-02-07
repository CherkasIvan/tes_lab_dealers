import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { _pgConfig, MongoDriverModule } from '@app/drivers';
import { ControllersModule } from './controllers/controllers.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { Db } from 'mongodb';
import { AmqpDriverModule } from '@app/drivers/amqp/amqp-driver.module';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { _amqpConfig } from '@app/drivers/amqp/amqp.config';
import { ChannelsModule } from './channels/channels.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DomainsModule } from './domains/domains.module';
import { ErrorHandlerModule } from '@app/common/exceptions';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [_pgConfig('PG_MAIN', 'DATABASE_URL'), _amqpConfig('amqp', 'AMQP_URI', { enableLogs: true, logPayload: false })],
        }),
        LoggerModule,
        // PgModule,
        // AdaptersModule,
        RabbitMQModule,
        DomainsModule,
        ScheduleModule.forRoot(),
        ChannelsModule,
        ErrorHandlerModule,
        AmqpDriverModule.forRoot([{ injectToken: AmqpConnection, configIdent: 'amqp' }]),
        MongoDriverModule.forRoot([
            {
                injectToken: Db.name,
                dbUrlEnvironment: 'MONGO_URL',
            },
        ]),
        ControllersModule,
    ],
    providers: [Logger],
    exports: [],
})
export class CoreModule {}
