import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { AppConfigFindHandler } from './find';
import { AppConfigGetHandler } from './get';

export const QUERY_HANDLERS: Type<ICommandHandler>[] = [
    AppConfigFindHandler,
    AppConfigGetHandler,
];

export { AppConfigFindQuery } from './find';
export { AppConfigGetQuery } from './get';
