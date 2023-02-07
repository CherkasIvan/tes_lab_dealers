import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter } from 'mongodb';
import { VehicleModel } from '../models';
import { bufferCount, concatAll, concatMap, forkJoin, from, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { fromAsyncIterable } from 'rxjs/internal/observable/innerFrom';
import { VehicleLastPacketModel } from '../models/vehicle-last-packet.model';
import { LastPacketInterface } from '../interfaces/last-packet.interface';
import { VEHICLE_MODEL_PIPELINE_QUERY } from './queries/vehicle-model-pipeline.query';
import { Vehicle } from '../interfaces/vehicle';
import { InternalLogger } from '@app/common';
import { VehicleDeviceIdInterface } from '../interfaces/vehicle-device-id.interface';
import { VehicleDeviceIdModel } from '../models/vehicle-device-id.model';

@Injectable()
export class VehicleRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.vehiclesCollection = this.db.collection<VehicleModel>('vehicles');
        this.lastPacketCollection = this.db.collection<VehicleLastPacketModel>('vehicles.last-packet');
        this.simIdCollection = this.db.collection<VehicleDeviceIdModel>('vehicles.device-id');
    }

    private readonly logger = new InternalLogger(VehicleRepository.name);

    private vehiclesCollection;
    private lastPacketCollection;
    private simIdCollection;

    async insertVehicles(vehicles: VehicleModel[]): Promise<void> {
        const savedVehiclesSet = new Set<string>();
        await this.vehiclesCollection.find({ vin: { $in: vehicles.map((vehicle) => vehicle.vin) } }).forEach((vehicle) => {
            savedVehiclesSet.add(vehicle.vin);
        });
        const filtered = vehicles.filter((vehicle) => !savedVehiclesSet.has(vehicle.vin)).map((vehicle) => new VehicleModel(vehicle));
        if (filtered.length) {
            await this.vehiclesCollection.insertMany(filtered);
        }
    }

    async updateVehicle(criteria: Partial<VehicleModel>, vehicle: Partial<VehicleModel>): Promise<void> {
        await this.vehiclesCollection.updateOne(criteria, { $set: vehicle });
    }

    async updateMany(updates: { criteria: Partial<VehicleModel>; vehicle: Partial<VehicleModel> }[]): Promise<void> {
        const writes = updates.map((item) => ({
            updateOne: { filter: item.criteria, update: { $set: item.vehicle } },
        }));
        await this.vehiclesCollection.bulkWrite(writes);
    }

    getAll(criteria: Filter<VehicleModel> = {}): Observable<VehicleModel> {
        const cursor = this.vehiclesCollection.find<VehicleModel>(criteria).map((item) => new VehicleModel(item));
        return from(cursor.stream());
    }

    getAllForUpdateVehicles(criteria: Filter<VehicleModel> = {}, page = 0, onPage = 10): Observable<VehicleModel[]> {
        const cursor = this.vehiclesCollection.find<VehicleModel>(criteria)
            .skip(page * onPage)
            .limit(onPage)
            .map((item) => new VehicleModel(item));
        return from(cursor.toArray());
    }

    findMany(criteria: Filter<VehicleModel> = {}, page = 0, onPage = 10): Promise<Vehicle[]> {
        return this.vehiclesCollection
            .find(criteria, { projection: { _id: 0 } })
            .skip(page * onPage)
            .limit(onPage)
            .map((vehicle) => new VehicleModel(vehicle))
            .toArray();
    }

    count(criteria: Filter<VehicleModel>): Promise<number> {
        return this.vehiclesCollection.count(criteria);
    }

    async saveLastPacket(vehicle: Vehicle, lastPacket: LastPacketInterface): Promise<void> {
        const count = await this.lastPacketCollection.count({ vin: vehicle.vin });
        if (count) {
            await this.lastPacketCollection.updateOne(
                { vin: vehicle.vin },
                { $set: { lastPacket, vin: vehicle.vin, simId: vehicle.simId, lastUpdate: new Date() } },
            );
        } else {
            await this.lastPacketCollection.insertOne({
                lastPacket,
                vin: vehicle.vin,
                simId: vehicle.simId,
                lastUpdate: new Date(),
            });
        }
    }

    getLastPacket(vin: string): Promise<VehicleLastPacketModel | null> {
        return this.lastPacketCollection.findOne({ vin });
    }

    async findOne(filter: Filter<VehicleModel>): Promise<Vehicle | null> {
        return this.vehiclesCollection.findOne<VehicleModel>(filter).then((vehicle) => (vehicle ? new VehicleModel(vehicle) : null));
    }

    async reaggregate(vins?: string[]): Promise<void> {
        this.logger.verbose('reaggregate start');
        const totalCount = vins?.length || (await this.count({}));
        this.logger.verbose(`reaggregate: totalCount: ${totalCount}`);
        let aggregation;
        if (vins && vins.length) {
            aggregation = VEHICLE_MODEL_PIPELINE_QUERY({ vin: { $in: vins } });
        } else {
            aggregation = VEHICLE_MODEL_PIPELINE_QUERY({});
        }
        let counter = 0;
        await lastValueFrom(
            fromAsyncIterable(this.vehiclesCollection.aggregate<VehicleModel>(aggregation).stream()).pipe(
                tap((vehicle) => {
                    this.logger.verbose(`reaggregate: vin ${vehicle.vin}, ${counter + 1}/${totalCount}`);
                    counter++;
                }),
                map((vehicle) => new VehicleModel(vehicle)),
                concatMap((vehicle) => from(this.updateVehicle({ vin: vehicle.vin }, vehicle))),
            ),
        );
        this.logger.verbose('reaggregate end');
    }

    async loadVehicleSimIds(pairs: VehicleDeviceIdInterface[]): Promise<void> {
        const batchSize = 1000;
        const batchCount = Math.ceil(pairs.length / batchSize);
        let counter = 0;
        await lastValueFrom(
            from(pairs).pipe(
                bufferCount(1000),
                concatMap((pairs) =>
                    forkJoin([of(pairs), from(this.simIdCollection.find({ vin: { $in: pairs.map((pair) => pair.vin) } }).toArray())]),
                ),
                map(([pairs, fetchedPairs]): [VehicleDeviceIdInterface[], Set<string>] => [
                    pairs,
                    new Set(fetchedPairs.map((pair) => pair.vin)),
                ]),
                map(([pairs, set]) => pairs.filter((pair) => !set.has(pair.vin))),
                map((pairs): VehicleDeviceIdModel[] => pairs.map((pair) => ({ vin: pair.vin, deviceId: pair.sim_id }))),
                concatMap((pairs) => from(this.simIdCollection.insertMany(pairs))),
                tap(() => this.logger.verbose(`loadVehicleSimIds: end processing batch ${counter + 1}/${batchCount}`)),
                tap(() => counter++),
            ),
        );
        this.logger.verbose('reaggregating vehicleDeviceIdRef');
        counter = 0;
        const totalCount = await this.count({});
        await lastValueFrom(
            this.getAll().pipe(
                bufferCount(1000),
                concatMap((vehicles) =>
                    from(this.simIdCollection.find({ vin: { $in: vehicles.map((vehicle) => vehicle.vin) } }).toArray()),
                ),
                concatAll(),
                concatMap((deviceIdRef) => from(this.updateVehicle({ vin: deviceIdRef.vin }, { vehicleDeviceIdRef: deviceIdRef }))),
                tap(() => this.logger.verbose(`vehicleDeviceId reaggregated: ${++counter} / ${totalCount}`)),
            ),
        );
    }
}
