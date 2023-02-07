import { AppConfigFindParams } from '../../../domain';

export class AppConfigFindQuery {
    constructor(
        public readonly params: AppConfigFindParams
    ) {
    }
}
