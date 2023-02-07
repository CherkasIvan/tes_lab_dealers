import { AppConfigWhereUnique } from '../../../domain';

export class AppConfigGetQuery {
    constructor(
        public readonly where: AppConfigWhereUnique
    ) {
    }
}
