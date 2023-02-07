import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { AppConfigCreateHandler } from './create';
import { AppConfigDeleteHandler } from './delete';
import { AppConfigUpdateHandler } from './update';

export const COMMAND_HANDLERS: Type<ICommandHandler>[] = [
    AppConfigCreateHandler,
    AppConfigDeleteHandler,
    AppConfigUpdateHandler,
];

export { AppConfigCreateCommand } from './create';
export { AppConfigDeleteCommand } from './delete';
export { AppConfigUpdateCommand } from './update';
