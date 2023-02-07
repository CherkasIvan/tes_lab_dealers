import { AppConfigCreatePayload } from '../../../domain';

export class AppConfigCreateCommand {
    constructor(
        public readonly payload: AppConfigCreatePayload
    ) {
    }
}
