import { AppConfigFacade } from '../application-services';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

/** фабрика фасада */
export const APP_CONFIG_FACADE_FACTORY = (commandBus: CommandBus, queryBus: QueryBus, eventBus: EventBus) =>
    new AppConfigFacade(commandBus, queryBus, eventBus);
