import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { DealerModel, DealerVehicleModel } from '../models';
import { DealerOfficeModel } from '../models/dealer-office.model';
import { Dealer } from '../interfaces/dealer.interface';
import { DealerOffice } from '../interfaces/dealer-office.interface';
import { VehicleRepository } from './vehicle.repository';
import { Observable } from 'rxjs';
import { Vehicle } from '../interfaces/vehicle';
import { DEALER_PIPELINE_QUERY } from './queries/dealer-pipeline.query';
import { DealerOfficeGeozone } from '../interfaces/dealer-office-geozone.interface';

@Injectable()
export class DealersRepository {
    constructor(@Inject(Db.name) private readonly db: Db, private readonly vehiclesRepository: VehicleRepository) {
        this.dealersCollection = db.collection<DealerModel>('dealers');
        this.dealerOfficeCollection = db.collection<DealerOfficeModel>('dealers.offices');
        this.dealerVehicleCollection = db.collection<DealerVehicleModel>('dealers.vehicles');
    }

    private dealersCollection;
    private dealerOfficeCollection;
    private dealerVehicleCollection;

    async test(): Promise<unknown> {
        return this.dealersCollection.countDocuments();
    }

    async saveDealers(dealers: DealerModel[]): Promise<void> {
        const dealerSet = new Set<string>();
        await this.dealersCollection.find({ sapCode: { $in: dealers.map((dealer) => dealer.sapCode) } }).forEach((dealer) => {
            dealerSet.add(dealer.sapCode);
        });
        const filtered = dealers.filter((dealer) => !dealerSet.has(dealer.sapCode));
        if (filtered.length) {
            await this.dealersCollection.insertMany(filtered);
        }
    }

    async saveDealerOffices(dealerOffices: DealerOfficeModel[]): Promise<void> {
        const officesSet = new Set<string>();
        await this.dealerOfficeCollection.find({ sapCode: { $in: dealerOffices.map((office) => office.sapCode) } }).forEach((office) => {
            officesSet.add(office.sapCode);
        });
        const filtered = dealerOffices.filter((office) => !officesSet.has(office.sapCode));
        if (filtered.length) {
            await this.dealerOfficeCollection.insertMany(filtered);
        }
    }

    async recalculateSales(): Promise<void> {
        const dealers = await this.dealersCollection.find().toArray();
        const dealerOffices = await this.dealerOfficeCollection.find().toArray();
        for (const dealer of dealers) {
            const count = await this.dealerVehicleCollection.count({ dealerSapCode: dealer.sapCode });
            await this.dealersCollection.updateOne({ sapCode: dealer.sapCode }, { $set: { totalSales: count } });
        }
        for (const dealerOffice of dealerOffices) {
            const count = await this.dealerVehicleCollection.count({ dealerOfficeSapCode: dealerOffice.sapCode });
            await this.dealerOfficeCollection.updateOne({ sapCode: dealerOffice.sapCode }, { $set: { totalSales: count } });
        }
    }

    async saveRelations(relations: DealerVehicleModel[]): Promise<void> {
        const savedRelations = new Set<string>();
        await this.dealerVehicleCollection
            .find({
                dealerSapCode: { $in: relations.map((relation) => relation.dealerSapCode) },
                vin: { $in: relations.map((relation) => relation.vin) },
                dealerOfficeSapCode: { $in: relations.map((relation) => relation.dealerOfficeSapCode) },
            })
            .forEach((relation) => {
                savedRelations.add(`${relation.dealerSapCode}:${relation.dealerOfficeSapCode}:${relation.vin}`);
            });
        const filtered = relations.filter(
            (relation) => !savedRelations.has(`${relation.dealerSapCode}:${relation.dealerOfficeSapCode}:${relation.vin}`),
        );
        if (filtered.length) {
            await this.dealerVehicleCollection.insertMany(filtered);
        }
    }

    getDealers(): Promise<Dealer[]> {
        return this.dealersCollection.aggregate<Dealer>(DEALER_PIPELINE_QUERY({})).toArray();
    }

    async getAllDealerOffices(): Promise<DealerOffice[]> {
        return this.dealerOfficeCollection
            .find()
            .map((dealerOffice) => new DealerOfficeModel(dealerOffice))
            .toArray();
    }

    async getDealerOffices(parentSapCodes: string[], dealerOfficeSapCodes: string[]): Promise<DealerOffice[]> {
        return this.dealerOfficeCollection
            .find({ $or: [{ parentSapCode: { $in: parentSapCodes } }, { sapCode: { $in: dealerOfficeSapCodes } }] })
            .map((dealerOffice) => new DealerOfficeModel(dealerOffice))
            .toArray();
    }

    async getDealerOffice(sapCode: string): Promise<DealerOffice | null> {
        return this.dealerOfficeCollection.findOne({ sapCode });
    }

    async getDealerVehicles(parentSapCodes: string[], dealerOfficeSapCodes: string[]): Promise<Observable<Vehicle>> {
        let dealerOffices: string[] = [];
        if (parentSapCodes.length) {
            dealerOffices = await this.dealerOfficeCollection
                .find({ parentSapCode: { $in: parentSapCodes } })
                .map((dealerOffice) => new DealerOfficeModel(dealerOffice).sapCode)
                .toArray();
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return this.vehiclesRepository.getAll({ 'dealerOfficeRef.sapCode': { $in: dealerOfficeSapCodes.concat(dealerOffices) } });
    }

    async updateDealerOfficeGeozone(sapCode: string, geozone: DealerOfficeGeozone) {
        return this.dealerOfficeCollection.updateOne(
            { sapCode },
            { $set: { geozone } }
        );
    }
}
