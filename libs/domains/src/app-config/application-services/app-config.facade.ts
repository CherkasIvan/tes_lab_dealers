import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
    AppConfigAggregate,
    AppConfigCreatePayload,
    AppConfigFindParams,
    AppConfigUpdatePayload,
    AppConfigWhereUnique,
} from '../domain';
import { AppConfigCreateCommand, AppConfigDeleteCommand, AppConfigUpdateCommand } from './commands';
import { AppConfigFindQuery, AppConfigGetQuery } from './queries';
import { AppConfigValue } from '@app/entities';
import { FindResult } from '@app/common';

export class AppConfigFacade {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus
    ) {
    }

    /**
     * Добавление конфига сервиса
     * @param payload
     */
    create(payload: AppConfigCreatePayload<{}>): Promise<void> {
        return this.commandBus.execute(new AppConfigCreateCommand(payload));
    }

    /**
     * Обновление конфига сервиса
     * @param where
     * @param payload
     */
    update(where: AppConfigWhereUnique, payload: AppConfigUpdatePayload<{}>): Promise<void> {
        return this.commandBus.execute(new AppConfigUpdateCommand(where, payload));
    }

    /**
     * Удаление конфига сервиса
     * @param where
     */
    delete(where: AppConfigWhereUnique): Promise<void> {
        return this.commandBus.execute(new AppConfigDeleteCommand(where));
    }

    /**
     * Получение конфига сервиса
     * @param where
     */
    get<T extends AppConfigValue = AppConfigValue>(where: AppConfigWhereUnique): Promise<AppConfigAggregate<T>> {
        return this.queryBus.execute(new AppConfigGetQuery(where));
    }

    /**
     * Получение списка конфигов сервиса
     * @param params
     */
    find(params: AppConfigFindParams): Promise<FindResult<AppConfigAggregate>> {
        return this.queryBus.execute(new AppConfigFindQuery(params));
    }
}
