import { ObjectId } from 'mongodb';
import { BluelinkDeviceInterface } from '../interfaces';

export interface BluelinkDeviceEntity {
    _id?: string | ObjectId;
    vin: string;
    device: BluelinkDeviceInterface | null;
    updatedAt: Date;
}
