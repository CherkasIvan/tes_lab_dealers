import { ObjectId } from 'mongodb';
import { BluelinkCsvDumpEntryInterface, BluelinkDeviceInterface } from '../interfaces';
import { Serializable } from '@app/common/interfaces/serializable';
import { BluelinkDeviceEntity } from '../entities/bluelink-device.entity';
import * as moment from 'moment/moment';

function strToDate(dateString: string): Date {
    return moment(dateString, 'YYYY-DD-MM').toDate();
}

export class BluelinkDeviceModel implements Serializable<BluelinkDeviceEntity> {
    _id?: string | ObjectId;
    vin!: string;
    device: BluelinkDeviceInterface | null = null;
    updatedAt: Date = new Date();

    constructor(data: Partial<BluelinkDeviceModel> & Pick<BluelinkDeviceModel, 'vin'>) {
        Object.assign(this, data);
    }

    serialize(): BluelinkDeviceEntity {
        return {
            vin: this.vin,
            device: this.device,
            _id: this._id,
            updatedAt: this.updatedAt,
        };
    }

    static fromCsvEntry(entry: BluelinkCsvDumpEntryInterface): BluelinkDeviceModel {
        return new BluelinkDeviceModel({
            vin: entry.VIN,
            updatedAt: new Date(),
            device: {
                vin: entry.VIN,
                activationDate: strToDate(entry.BLueLikActivationDate),
                carDesc: entry.Car_Desc,
                bodyCode: entry.Car_Line,
                carLineDesc: entry.Car_Line_Desc,
                phone: entry.Telephone || entry.Mobile_Phone,
                status: entry.BlueLinkStatus,
                mobikeyStatus: entry.MobiKeyStatus,
            },
        });
    }
}
