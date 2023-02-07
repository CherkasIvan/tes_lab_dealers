import { DynamicModule, Module, OnModuleInit, Type } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import {
    COMMAND_HANDLERS,
    QUERY_HANDLERS,
    AppConfigFacade,
} from './application-services';
import {
    AppConfigRepository,
    APP_CONFIG_FACADE_FACTORY,
} from './providers';


interface AppConfigModuleProviders {
    /** реализация репозитория */
    repository: Type<AppConfigRepository>;
}

/**
 * Домен конфигов сервиса
 */
@Module({})
export class AppConfigDomainModule implements OnModuleInit {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
    }

    /**
     * Инициализация модуля
     * @param providers провайдеры для домена
     */
    static forRoot(providers: AppConfigModuleProviders): DynamicModule {
        return {
            module: AppConfigDomainModule,
            imports: [CqrsModule],
            providers: [
                /** подключаем репозиторий */
                {
                    provide: AppConfigRepository,
                    useClass: providers.repository,
                },
                /** фасад бизнес правил */
                {
                    provide: AppConfigFacade,
                    useFactory: APP_CONFIG_FACADE_FACTORY,
                    inject: [CommandBus, QueryBus, EventBus],
                },
                /** подключаем CQRS */
                CommandBus,
                ...COMMAND_HANDLERS,
                QueryBus,
                ...QUERY_HANDLERS,
                EventBus,
            ],
            exports: [
                /** публикуем фасад */
                AppConfigFacade,
            ],
        };
    }

    onModuleInit(): void {
        this.commandBus.register(COMMAND_HANDLERS);
        this.queryBus.register(QUERY_HANDLERS);
    }
}
