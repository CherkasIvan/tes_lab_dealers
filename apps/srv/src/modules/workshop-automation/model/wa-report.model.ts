import { WAVehicleInfoResponseDto } from '../../../channels/workshop-automation/dto';
import { ObjectId } from 'mongodb';

export interface WaReportModel {
    _id?: string | ObjectId;
    vin: string;
    updatedAt: Date;
    waInfo: WAVehicleInfoResponseDto | null;
}
