import { ObjectId } from 'mongodb';
import { BluelinkBasicInfoType, BluelinkGpsInfoType, BluelinkLastPacketInterface, BluelinkVehicleStatusType } from '../interfaces';

export class BluelinkLastPacketModel implements BluelinkLastPacketInterface {
    _id?: ObjectId | string;
    basicInfo: BluelinkBasicInfoType | null = null;
    gpsInfo: BluelinkGpsInfoType | null = null;
    updatedAt: Date = new Date();
    vehicleStatus: BluelinkVehicleStatusType | null = null;
    vin!: string;

    constructor(data: Partial<BluelinkLastPacketModel> & Pick<BluelinkLastPacketModel, 'vin'>) {
        Object.assign(this, data);
    }
}
