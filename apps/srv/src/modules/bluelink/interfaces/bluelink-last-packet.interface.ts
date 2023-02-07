import { BluelinkGpsInfoType } from './bluelink-gps-info.type';
import { BluelinkVehicleStatusType } from './bluelink-vehicle-status.type';
import { BluelinkBasicInfoType } from './bluelink-basic-info.type';

export interface BluelinkLastPacketInterface {
    vin: string;
    gpsInfo: BluelinkGpsInfoType | null;
    vehicleStatus: BluelinkVehicleStatusType | null;
    basicInfo: BluelinkBasicInfoType | null;
}
