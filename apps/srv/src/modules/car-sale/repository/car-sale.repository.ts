import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter } from 'mongodb';
import { CarSaleApplicationEntity } from '../entity/car-sale-application.entity';
import { Serializable } from '@app/common/interfaces/serializable';
import { CarSaleVehicleModel } from '../models/car-sale-vehicle.model';
import { ApplicationProposalInterface } from '../interfaces/application-proposal.interface';

@Injectable()
export class CarSaleRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.collection = db.collection<CarSaleApplicationEntity>('car-sale-applications');
    }

    private readonly collection;

    async saveCarSaleApplication(data: Serializable<CarSaleApplicationEntity> | CarSaleApplicationEntity): Promise<void> {
        const serialized = 'serialize' in data ? data.serialize() : data;
        const saved = await this.findOne({ applicationId: serialized.applicationId });
        if (!saved) {
            await this.collection.insertOne(serialized);
        } else {
            delete serialized._id;
            await this.collection.replaceOne({ applicationId: serialized.applicationId }, serialized);
        }
    }

    count(filter: Filter<CarSaleApplicationEntity>): Promise<number> {
        return this.collection.countDocuments(filter);
    }

    findMany(filter: Filter<CarSaleApplicationEntity>, page = 0, onPage = 15): Promise<CarSaleVehicleModel[]> {
        return this.collection
            .find(filter, { sort: ['publicationDate', -1] })
            .skip(page * onPage)
            .limit(onPage)
            .map((item) => new CarSaleVehicleModel(item))
            .toArray();
    }

    findOne(filter: Partial<CarSaleApplicationEntity>): Promise<CarSaleVehicleModel | null> {
        return this.collection.findOne(filter).then((result) => (result ? new CarSaleVehicleModel(result) : null));
    }

    updateApplicationProposals(applicationId: string, applicationProposals: ApplicationProposalInterface[]) {
        return this.collection.updateOne({ applicationId }, { $set: { applicationProposals } });
    }
}
