import { AutostatVehicleInterface } from './autostat-vehicle.interface';

export interface AutostatReport extends AutostatVehicleInterface {
    updatedAt: Date;
    createdAt: Date;
    raw: object;
}
