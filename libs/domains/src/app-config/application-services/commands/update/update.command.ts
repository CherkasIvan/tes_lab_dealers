import { AppConfigUpdatePayload, AppConfigWhereUnique } from '../../../domain';

export class AppConfigUpdateCommand {
    constructor(
        public readonly where: AppConfigWhereUnique,
        public readonly payload: AppConfigUpdatePayload
    ) {
    }
}
