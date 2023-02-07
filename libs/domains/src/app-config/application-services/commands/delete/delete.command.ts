import { AppConfigWhereUnique } from '../../../domain';

export class AppConfigDeleteCommand {
    constructor(
        public readonly where: AppConfigWhereUnique
    ) {
    }
}
