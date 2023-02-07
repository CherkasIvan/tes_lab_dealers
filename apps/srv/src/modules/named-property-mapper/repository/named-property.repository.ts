import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { NamedPropertyModel } from '../models';

@Injectable()
export class NamedPropertyRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.namedPropertyCollection = db.collection<NamedPropertyModel>('named-property');
    }

    private namedPropertyCollection;

    findOne(filter: Partial<Pick<NamedPropertyModel, 'scope' | 'value' | 'code'>>): Promise<NamedPropertyModel | null> {
        return this.namedPropertyCollection.findOne(filter).then((result) => result);
    }

    async save(model: NamedPropertyModel): Promise<void> {
        const count = await this.namedPropertyCollection.count({
            scope: model.scope,
            key: model.value,
            code: model.code,
        });
        if (count) {
            await this.namedPropertyCollection.updateOne(
                {
                    scope: model.scope,
                    key: model.value,
                    code: model.code,
                },
                { $set: model },
            );
            return;
        }
        await this.namedPropertyCollection.insertOne(model);
    }
}
