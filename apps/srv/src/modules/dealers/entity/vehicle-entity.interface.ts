import { ObjectId } from 'mongodb';
import { VehicleLastPacketModel } from '../models/vehicle-last-packet.model';
import { DealerOfficeModel } from '../models/dealer-office.model';
import { AutostatReport } from '../../autostat/interfaces/autostat-report';
import { DealerModel, DealerVehicleModel } from '../models';
import { WaReportModel } from '../../workshop-automation/model';
import { OcnReportModel } from '../../ocn-catalog/model';

export interface VehicleEntityInterface {
    _id?: ObjectId | string;
    model: string;
    fullModelName: string;
    vin: string;
    ocn: string | null;
    simId: string | null;
    deviceType: string;
    deviceActiveStatus: string;
    address: string | null;
    addressUpdatedAt: Date | null;
    activationDate: Date | null;
    retailDate: Date | null;
    lastPacketRef: VehicleLastPacketModel | null;
    dealerOfficeRef: DealerOfficeModel | null;
    autostatReportRef: AutostatReport | null;
    vehicleRelationRef: DealerVehicleModel | null;
    dealerRef: DealerModel | null;
    waInfoRef: WaReportModel | null;
    ocnInfoRef: OcnReportModel | null;
    updatedAt: Date | null;
    activationChangedAt: Date | null;
}
