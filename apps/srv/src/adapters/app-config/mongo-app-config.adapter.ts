import { AppConfigAggregate, AppConfigFindParams, AppConfigRepository, AppConfigWhereUnique } from '@app/domains';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { FindResult } from '@app/common';
import { AppConfigEntity } from '@app/entities';

@Injectable()
export class MongoAppConfigAdapter extends AppConfigRepository {
    private readonly logger = new Logger(MongoAppConfigAdapter.name);

    constructor(@Inject('Db') private readonly db: Db) {
        super();
        this.configCollection = db.collection<AppConfigEntity>('config');
    }

    private configCollection;

    async delete(where: AppConfigWhereUnique): Promise<void> {
        await this.configCollection.deleteOne(where);
    }

    async find(params: AppConfigFindParams): Promise<FindResult<AppConfigAggregate>> {
        //todo: implement params handling
        const rows = await this.configCollection.find().toArray();
        const totalCount = await this.configCollection.countDocuments();
        return {
            rows,
            total: totalCount,
        };
    }

    findUnique(where: AppConfigWhereUnique): Promise<AppConfigAggregate | null> {
        return this.configCollection
            .findOne({ ident: where.ident }, { projection: { _id: 0 } })
            .then((result) => (result ? new AppConfigAggregate(result as AppConfigAggregate) : null));
    }

    async save(aggregate: AppConfigAggregate): Promise<void> {
        const count = await this.configCollection.count({ ident: aggregate.ident });
        if (count) {
            await this.configCollection.updateOne(
                { ident: aggregate.ident },
                {
                    group: aggregate.group,
                    type: aggregate.type,
                    value: aggregate.value,
                },
            );
        } else {
            await this.configCollection.insertOne(aggregate);
        }
    }
}
