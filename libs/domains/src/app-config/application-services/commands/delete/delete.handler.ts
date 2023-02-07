import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppConfigDeleteCommand } from './delete.command';
import { AppConfigRepository } from '../../../providers';

@CommandHandler(AppConfigDeleteCommand)
export class AppConfigDeleteHandler implements ICommandHandler<AppConfigDeleteCommand, void> {
    constructor(
        private readonly repository: AppConfigRepository
    ) {
    }

    execute(command: AppConfigDeleteCommand): Promise<void> {
        return this.repository.delete(command.where);
    }
}
