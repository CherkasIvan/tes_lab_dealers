import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppConfigFindQuery } from './find.query';
import { FindResult } from '@app/common';
import { AppConfigAggregate } from '../../../domain';
import { AppConfigRepository } from '../../../providers';

@QueryHandler(AppConfigFindQuery)
export class AppConfigFindHandler implements IQueryHandler<AppConfigFindQuery, FindResult<AppConfigAggregate>> {
    constructor(
        private readonly repository: AppConfigRepository
    ) {
    }

    execute(query: AppConfigFindQuery): Promise<FindResult<AppConfigAggregate>> {
        return this.repository.find(query.params);
    }
}
