import { Db } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { BluelinkLastPacketModel } from '../models/bluelink-last-packet.model';
import { BluelinkDeviceModel } from '../models/bluelink-device.model';
import { Serializable } from '@app/common/interfaces/serializable';
import { BluelinkDeviceEntity } from '../entities/bluelink-device.entity';

@Injectable()
export class BluelinkRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.bluelinkInfoCollection = db.collection<BluelinkLastPacketModel>('vehicles.bluelink-data');
        this.bluelinkDeviceCollection = db.collection<BluelinkDeviceEntity>('vehicles.bluelink-device');
    }

    private bluelinkInfoCollection;
    private bluelinkDeviceCollection;

    getBluelinkDeviceInfo(vin: string): Promise<BluelinkDeviceModel | null> {
        return this.bluelinkDeviceCollection.findOne({ vin }).then((result) => (result ? new BluelinkDeviceModel(result) : null));
    }

    getBluelinkLastPacket(vin: string): Promise<BluelinkLastPacketModel | null> {
        return this.bluelinkInfoCollection.findOne({ vin }).then((result) => (result ? new BluelinkLastPacketModel(result) : null));
    }

    async saveDeviceInfo(vehicleInfo: Serializable<BluelinkDeviceEntity>): Promise<void> {
        const serialized = vehicleInfo.serialize();
        const count = await this.bluelinkDeviceCollection.count({ vin: serialized.vin });
        if (count) {
            await this.bluelinkDeviceCollection.updateOne({ vin: serialized.vin }, { $set: serialized });
            return;
        }
        await this.bluelinkDeviceCollection.insertOne(serialized);
    }

    async saveLastPacket(lastPacket: BluelinkLastPacketModel): Promise<void> {
        const count = await this.bluelinkInfoCollection.count({ vin: lastPacket.vin });
        if (count) {
            await this.bluelinkInfoCollection.updateOne({ vin: lastPacket.vin }, { $set: lastPacket });
            return;
        }
        await this.bluelinkInfoCollection.insertOne(lastPacket);
    }

    async insertDevices(prepared: BluelinkDeviceModel[], force = false): Promise<BluelinkDeviceModel[]> {
        const savedDevicesSet = new Set<string>();
        await this.bluelinkDeviceCollection.find({ vin: { $in: prepared.map((item) => item.vin) } }).forEach((device) => {
            savedDevicesSet.add(device.vin);
        });
        if (force) {
            await this.bluelinkDeviceCollection.deleteMany({ vin: { $in: Array.from(savedDevicesSet) } });
            await this.bluelinkDeviceCollection.insertMany(prepared);
            return prepared;
        }
        const filtered = prepared.filter((item) => !savedDevicesSet.has(item.vin));
        if (filtered.length) {
            await this.bluelinkDeviceCollection.insertMany(filtered);
            return filtered;
        }
        return [];
    }
}
