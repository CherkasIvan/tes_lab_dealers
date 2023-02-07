import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppConfigGetQuery } from './get.query';
import { AppConfigAggregate } from '../../../domain';
import { AppConfigRepository } from '../../../providers';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(AppConfigGetQuery)
export class AppConfigGetHandler implements IQueryHandler<AppConfigGetQuery, AppConfigAggregate> {
    constructor(
        private readonly repository: AppConfigRepository
    ) {
    }

    async execute(query: AppConfigGetQuery): Promise<AppConfigAggregate> {
        const config = await this.repository.findUnique(query.where);

        if (!config) {
            throw new NotFoundException();
        }

        return config;
    }
}
