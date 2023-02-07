import { AppConfigRepository } from '@app/domains/app-config/providers';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppConfigUpdateCommand } from '@app/domains/app-config/application-services/commands/update/update.command';
import { NotFoundException } from '@nestjs/common';
import { AppConfigAggregate } from '@app/domains/app-config/domain';

@CommandHandler(AppConfigUpdateCommand)
export class AppConfigUpdateHandler implements ICommandHandler<AppConfigUpdateCommand, void> {
    constructor(
        private readonly repository: AppConfigRepository
    ) {
    }

    async execute(command: AppConfigUpdateCommand): Promise<void> {
        const config = await this.repository.findUnique(command.where);

        if (!config) {
            throw new NotFoundException();
        }

        const aggregate = new AppConfigAggregate({
            ...config,
            ...command.payload,
        });

        return this.repository.save(aggregate);
    }
}
