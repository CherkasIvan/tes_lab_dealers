import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppConfigCreateCommand } from './create.command';
import { AppConfigRepository } from '../../../providers';
import { ConflictException } from '@nestjs/common';
import { AppConfigAggregate } from '../../../domain';

@CommandHandler(AppConfigCreateCommand)
export class AppConfigCreateHandler implements ICommandHandler<AppConfigCreateCommand, void> {
    constructor(
        private readonly repository: AppConfigRepository
    ) {
    }

    async execute({ payload }: AppConfigCreateCommand): Promise<void> {
        const existedConfig = await this.repository.findUnique({ ident: payload.ident });

        if (existedConfig) {
            throw new ConflictException();
        }

        const aggregate = new AppConfigAggregate(payload);
        return this.repository.save(aggregate);
    }
}
