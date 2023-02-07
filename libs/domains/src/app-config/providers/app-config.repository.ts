import { AppConfigAggregate, AppConfigFindParams, AppConfigWhereUnique } from '@app/domains/app-config/domain';
import { FindResult } from '@app/common';

export abstract class AppConfigRepository {
    public abstract find(params: AppConfigFindParams): Promise<FindResult<AppConfigAggregate>>;
    public abstract findUnique(where: AppConfigWhereUnique): Promise<AppConfigAggregate | null>;
    public abstract save(aggregate: AppConfigAggregate): Promise<void>;
    public abstract delete(where: AppConfigWhereUnique): Promise<void>;
}
