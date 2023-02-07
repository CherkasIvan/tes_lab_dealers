export interface ConnectedBluelinkVehicleStatusInterface {
    vin: string;
    airTempVal: string;
    fuelLevel: number;
    dteDistanceVal: number;
    fuelWarningLight: string;
    engineOilStatus: string;
    breakOilStatus: string;
    tpmsAllStatus: string;
    washerFluidStatus: string;
    smartKeyBatteryWarning: string;
    batSoc: number;
    engineRunTimeVal: number;
    timestamp: string;
}

export interface DisconnectedBluelinkVehicleStatusInterface {
    vin: string;
}

export type BluelinkVehicleStatusType = ConnectedBluelinkVehicleStatusInterface | DisconnectedBluelinkVehicleStatusInterface;

export interface BluelinkVehicleStatusResponseInterface {
    vehicleStatus: BluelinkVehicleStatusType;
}
