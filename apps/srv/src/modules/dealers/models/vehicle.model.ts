import { VehicleLastPacketModel } from './vehicle-last-packet.model';
import { DealerOfficeModel } from './dealer-office.model';
import { AutostatReport } from '../../autostat/interfaces/autostat-report';
import { ObjectId } from 'mongodb';
import { DealerVehicleModel } from './dealer-vehicle.model';
import { DealerModel } from './dealer.model';
import { Vehicle } from '../interfaces/vehicle';
import { DealerOffice } from '../interfaces/dealer-office.interface';
import { LastPacketInterface } from '../interfaces/last-packet.interface';
import { VehicleSourceUpdateInterface } from '../interfaces/vehicle-source-update.interface';
import { WaReportModel } from '../../workshop-automation/model';
import { WAVehicleInfoResponseDto } from '../../../channels/workshop-automation/dto';
import { OcnDataInterface } from '../../ocn-catalog/interfaces/ocn-data.interface';
import { OcnReportModel } from '../../ocn-catalog/model';
import { VehicleEntityInterface } from '../entity/vehicle-entity.interface';
import { VehicleDeviceIdModel } from './vehicle-device-id.model';
import { VehicleLocationInterface } from '../interfaces/vehicle-location.interface';
import { FuelConsumptionInterface } from '../interfaces/fuel-consumption.interface';
import { BluelinkDeviceModel } from '../../bluelink/models/bluelink-device.model';
import { BluelinkLastPacketModel } from '../../bluelink/models/bluelink-last-packet.model';

export class VehicleModel implements Vehicle, VehicleEntityInterface {
    _id?: ObjectId | string;
    model = '';
    fullModelName = '';
    vin = '';
    ocn: string | null = null;
    simId: string | null = null;
    deviceType = '';
    deviceActiveStatus = '';
    address: string | null = null;
    addressUpdatedAt: Date | null = null;
    activationDate: Date | null = null;
    retailDate: Date | null = null;
    lastPacketRef: VehicleLastPacketModel | null = null;
    dealerOfficeRef: DealerOfficeModel | null = null;
    autostatReportRef: AutostatReport | null = null;
    vehicleRelationRef: DealerVehicleModel | null = null;
    dealerRef: DealerModel | null = null;
    waInfoRef: WaReportModel | null = null;
    ocnInfoRef: OcnReportModel | null = null;
    vehicleDeviceIdRef: VehicleDeviceIdModel | null = null;
    bluelinkDeviceRef: BluelinkDeviceModel | null = null;
    bluelinkLastPacketRef: BluelinkLastPacketModel | null = null;
    updatedAt: Date | null = null;
    activationChangedAt: Date | null = null;

    constructor(data: VehicleEntityInterface) {
        Object.assign(this, data);
    }

    get autostatInfo(): AutostatReport | null {
        if (!this.isActivated()) {
            return null;
        }
        return this.autostatReportRef;
    }
    get dealer(): DealerOffice | null {
        return this.dealerOfficeRef;
    }
    get lastPacket(): LastPacketInterface | null {
        if (!this.isActivated()) {
            return null;
        }
        return this.lastPacketRef?.lastPacket || null;
    }
    get sources(): VehicleSourceUpdateInterface[] {
        return [];
    }
    get waInfo(): WAVehicleInfoResponseDto | null {
        return this.waInfoRef?.waInfo || null;
    }
    get ocnInfo(): OcnDataInterface | null {
        return this.ocnInfoRef?.ocnData || null;
    }

    getActivationDate(): Date | null {
        if (!this.isActivated() || !this.activationDate || this.activationDate.getFullYear() < 2019) {
            return null;
        }
        return this.activationDate;
    }

    getDrivingStyle(): number {
        if (!this.isActivated() || !this.lastPacket?.drivingStyle) {
            return 0;
        }
        return this.lastPacket.drivingStyle;
    }

    getMileage(): number | null {
        if (!this.isActivated() || !this.lastPacket?.mileage) {
            return null;
        }
        return this.lastPacket.mileage;
    }

    getMotoHours(): number {
        if (!this.isActivated() || !this.lastPacket?.motoHours) {
            return 0;
        }
        return this.lastPacket.motoHours;
    }

    getAverageSpeed(): number | null {
        if (!this.isActivated() || !this.lastPacket?.mileage) {
            return null;
        }
        return Math.round(this.lastPacket.mileage / this.lastPacket.motoHours);
    }

    isActivated(): boolean {
        return this.deviceActiveStatus === 'Активирован';
    }

    getVoltage(): number | null {
        if (!this.isActivated() || !this.lastPacket?.batteryVoltage) {
            return null;
        }
        return this.lastPacket.batteryVoltage;
    }

    getLastPacketDate(): Date | null {
        if (!this.isActivated() || !this.lastPacket?.packetTime) {
            return null;
        }
        return new Date(this.lastPacket.packetTime);
    }

    getDeviceId(): string {
        return this.simId || this.vehicleDeviceIdRef?.deviceId || this.vin;
    }

    mtaDataAvailable(): boolean {
        return this.getDeviceId() !== null;
    }

    getGenerationName(): string {
        return this.autostatInfo?.generation || this.ocnInfo?.generation.name || '';
    }

    getGenerationCode(): string {
        return '';
    }

    getGenerationId(): string {
        return this.ocnInfo?.generation.id || '';
    }

    getPower(): number {
        return Number(this.autostatInfo?.horsePower) || Number(this.ocnInfo?.modification?.power) || 0;
    }

    getTransmissionType(): string {
        return (
            this.autostatInfo?.transmissionsType ||
            this.waInfo?.vehicle.transmission ||
            this.ocnInfo?.modification?.transmission?.name ||
            ''
        );
    }

    getDriveType(): string {
        return this.autostatInfo?.gearingType || this.ocnInfo?.modification?.driveType?.name || '';
    }

    getEngineName(): string {
        return this.ocnInfo?.modification?.engine?.name || '';
    }

    getEngineVolumeCm(): string {
        return this.autostatInfo?.engineVolumeCm || '';
    }

    getEngineVolumeL(): string {
        return (
            this.autostatInfo?.engineVolumeL ||
            this.waInfo?.vehicle?.engineCode ||
            this.ocnInfo?.modification?.engine?.volume.toString() ||
            ''
        );
    }

    getFuelType(): string {
        return this.autostatInfo?.fuelType || this.ocnInfo?.modification?.engine?.engineFuelType?.name || '';
    }

    getProductionYear(): string {
        return this.autostatInfo?.yearOfProduction || this.waInfo?.vehicle.modelYear || '';
    }

    getEuroClass(): string {
        return this.autostatInfo?.euroClass || '';
    }

    getLocation(): VehicleLocationInterface | null {
        if (!this.isActivated() || !this.lastPacket) {
            return null;
        }
        return {
            lon: Number(this.lastPacket.longitude),
            lat: Number(this.lastPacket.latitude),
        };
    }

    getBrand(): string {
        return this.autostatInfo?.manufacture || this.ocnInfo?.generation.model.manufacture.name || '';
    }

    getEquipmentName(): string {
        return this.ocnInfo?.equipment.name || '';
    }

    getFuelConsumption(): FuelConsumptionInterface {
        return {
            mixed: this.ocnInfo?.modification.fuelConsumption || 0,
            highway: this.ocnInfo?.modification.fuelConsHw || 0,
            city: this.ocnInfo?.modification.fuelConsCity || 0,
        };
    }

    getLastPacketSendDate(): Date | null {
        if (!this.isActivated() || !this.lastPacket?.packetTime) {
            return null;
        }
        return new Date(this.lastPacket.packetTime);
    }

    getLastPacketUpdateDate(): Date | null {
        return this.lastPacketRef?.lastUpdate || null;
    }

    getModificationName(): string {
        return this.ocnInfo?.modification.name || '';
    }

    getPromoImages(): string[] {
        return this.ocnInfo?.generation.promo.photos.map((photo) => photo.img) || [];
    }

    getSapRetailDate(): Date | null {
        return this.waInfo?.vehicle?.retailDateSap ? new Date(this.waInfo?.vehicle.retailDateSap) : null;
    }

    getTankCapacity(): number | null {
        return this.ocnInfo?.generation.fuelTank || null;
    }

    getWarrantyStartDate(): Date | null {
        return this.waInfo?.vehicle.warrantyStartDate ? new Date(this.waInfo?.vehicle.warrantyStartDate) : null;
    }

    getDeviceActiveStatus(): string {
        if (this.isActivated() && !this.lastPacket) {
            return 'Не активирован';
        }
        return this.deviceActiveStatus;
    }

    getRetailDate(): string {
        if (!this.retailDate) {
            return '';
        }
        return this.retailDate.toISOString();
    }

    changeDeviceActiveStatus(active: boolean) {
        this.deviceActiveStatus = active ? 'Активирован' : 'Деактивирован';
        const now = new Date();
        if (active) {
            this.activationDate = now;
        } else {
            this.activationDate = null;
        }
        this.activationChangedAt = now;
        this.updatedAt = now;
    }
}
