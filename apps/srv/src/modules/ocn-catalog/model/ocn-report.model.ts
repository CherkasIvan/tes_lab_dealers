import { ObjectId } from 'mongodb';
import { OcnDataInterface } from '../interfaces/ocn-data.interface';

export class OcnReportModel {
    _id?: string | ObjectId;
    ocn = '';
    updatedAt: Date = new Date();
    ocnData: OcnDataInterface | null = null;

    constructor(data: OcnReportModel) {
        Object.assign(this, data);
    }
}
