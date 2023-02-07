import { Vehicle } from '../../dealers/interfaces/vehicle';
import { CarSaleApplicationEntity } from '../entity/car-sale-application.entity';
import { AutostatReport } from '../../autostat/interfaces/autostat-report';
import { DealerOffice } from '../../dealers/interfaces/dealer-office.interface';
import { LastPacketInterface } from '../../dealers/interfaces/last-packet.interface';
import { OcnDataInterface } from '../../ocn-catalog/interfaces/ocn-data.interface';
import { VehicleSourceUpdateInterface } from '../../dealers/interfaces/vehicle-source-update.interface';
import { WAVehicleInfoResponseDto } from '../../../channels/workshop-automation/dto';
import { FuelConsumptionInterface } from '../../dealers/interfaces/fuel-consumption.interface';
import { VehicleLocationInterface } from '../../dealers/interfaces/vehicle-location.interface';
import { Serializable } from '@app/common/interfaces/serializable';
import { CarSaleCustomerInterface } from '../interfaces/car-sale-customer.interface';
import { ApplicationProposalInterface } from '../interfaces/application-proposal.interface';

export class CarSaleVehicleModel implements Vehicle, Serializable<CarSaleApplicationEntity> {
    constructor(private entity: CarSaleApplicationEntity) { }

    get activationDate(): Date | null {
        return null;
    }
    get address(): string | null {
        return null;
    }
    get addressUpdatedAt(): Date | null {
        return null;
    }
    get autostatInfo(): AutostatReport | null {
        return null;
    }
    get dealer(): DealerOffice | null {
        return null;
    }
    get deviceActiveStatus(): string {
        return this.entity.vehicle?.vehicle.blocks[0]?.active ? 'Активирован' : 'Не активирован';
    }

    get deviceType(): string {
        const activeDevice = this.entity.vehicle?.vehicle.blocks[0];
        if (activeDevice) {
            return `${activeDevice.type} ${activeDevice.model}`;
        }
        return '';
    }

    get fullModelName(): string {
        return (
            this.entity.vehicle?.vehicle.model || this.entity.waInfo?.vehicle?.modelName || this.entity.ocnInfo?.generation.model.name || ''
        );
    }
    get lastPacket(): LastPacketInterface | null {
        return this.entity.vehicleLastPacket;
    }
    get model(): string {
        return (
            this.entity.vehicle?.vehicle.model || this.entity.waInfo?.vehicle?.modelName || this.entity.ocnInfo?.generation.model.name || ''
        );
    }
    get ocnInfo(): OcnDataInterface | null {
        return this.entity.ocnInfo;
    }
    get retailDate(): Date | null {
        return this.waInfo?.vehicle.retailDateSap ? new Date(this.waInfo?.vehicle.retailDateSap) : null;
    }
    get simId(): string | null {
        return null;
    }
    sources: VehicleSourceUpdateInterface[] = [];
    get vin(): string {
        return this.entity.vin;
    }

    get waInfo(): WAVehicleInfoResponseDto | null {
        return this.entity.waInfo;
    }

    changeDeviceActiveStatus(active: boolean): void {
        return;
    }

    getActivationDate(): Date | null {
        return null;
    }

    getBrand(): string {
        return this.entity.vehicle?.vehicle.brand || this.ocnInfo?.generation?.model?.manufacture.name || '';
    }

    getDeviceActiveStatus(): string {
        return this.deviceActiveStatus;
    }

    getDeviceId(): string {
        return this.entity.vehicle?.vehicle.telemetryBlocks[0] || '';
    }

    getDriveType(): string {
        return this.entity.vehicle?.vehicle.modification.driveType || this.ocnInfo?.modification?.driveType?.name || '';
    }

    getDrivingStyle(): number {
        if (!this.isActivated() || !this.lastPacket?.drivingStyle) {
            return 0;
        }
        return this.lastPacket.drivingStyle;
    }

    getEngineName(): string {
        return this.ocnInfo?.modification?.engine?.name || '';
    }

    getEngineVolumeCm(): string {
        return this.entity.vehicle?.vehicle.modification.engineVolumeCm || '';
    }

    getEngineVolumeL(): string {
        return (
            this.entity.vehicle?.vehicle.modification.engineVolumeL ||
            this.waInfo?.vehicle?.engineCode ||
            this.ocnInfo?.modification?.engine?.volume.toString() ||
            ''
        );
    }

    getEquipmentName(): string {
        return this.entity.vehicle?.vehicle.equipment.name || this.ocnInfo?.equipment.name || '';
    }

    getEuroClass(): string {
        return '';
    }

    getFuelConsumption(): FuelConsumptionInterface {
        return {
            mixed: this.ocnInfo?.modification.fuelConsumption || 0,
            highway: this.ocnInfo?.modification.fuelConsHw || 0,
            city: this.ocnInfo?.modification.fuelConsCity || 0,
        };
    }

    getFuelType(): string {
        return this.entity.vehicle?.vehicle.modification.fuelType || this.ocnInfo?.modification?.engine?.engineFuelType?.name || '';
    }

    getGenerationCode(): string {
        return '';
    }

    getGenerationId(): string {
        return this.ocnInfo?.generation.id || '';
    }

    getGenerationName(): string {
        return this.entity.vehicle?.vehicle.generation.name || this.ocnInfo?.generation.name || '';
    }

    getLastPacketDate(): Date | null {
        if (!this.isActivated() || !this.lastPacket?.packetTime) {
            return null;
        }
        return new Date(this.lastPacket.packetTime);
    }

    getLastPacketSendDate(): Date | null {
        if (!this.isActivated() || !this.lastPacket?.packetTime) {
            return null;
        }
        return new Date(this.lastPacket.packetTime);
    }

    getLastPacketUpdateDate(): Date | null {
        return this.getLastPacketSendDate();
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

    getMileage(): number | null {
        if (!this.isActivated() || !this.lastPacket) {
            return null;
        }
        return this.lastPacket.mileage;
    }

    getModificationName(): string {
        return this.entity.vehicle?.vehicle.modification.name || this.ocnInfo?.modification.name || '';
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

    getPower(): number {
        return this.entity.vehicle?.vehicle.modification.power || Number(this.ocnInfo?.modification?.power) || 0;
    }

    getProductionYear(): string {
        return this.entity.vehicle?.vehicle.issueYear || this.waInfo?.vehicle.modelYear || '';
    }

    getPromoImages(): string[] {
        return [];
    }

    getRetailDate(): string {
        return this.retailDate?.toISOString() || '';
    }

    getSapRetailDate(): Date | null {
        return this.retailDate;
    }

    getTankCapacity(): number | null {
        return this.entity.vehicle?.vehicle.modification.tankCapacity || this.ocnInfo?.generation.fuelTank || null;
    }

    getTransmissionType(): string {
        return (
            this.entity.vehicle?.vehicle.modification.transmissionType ||
            this.waInfo?.vehicle.transmission ||
            this.ocnInfo?.modification?.transmission?.name ||
            ''
        );
    }

    getVoltage(): number | null {
        if (!this.isActivated() || !this.lastPacket?.batteryVoltage) {
            return null;
        }
        return this.lastPacket.batteryVoltage;
    }

    getWarrantyStartDate(): Date | null {
        return this.waInfo?.vehicle.warrantyStartDate ? new Date(this.waInfo?.vehicle.warrantyStartDate) : null;
    }

    isActivated(): boolean {
        return this.deviceActiveStatus === 'Активирован';
    }

    mtaDataAvailable(): boolean {
        return this.lastPacket !== null;
    }

    serialize(): CarSaleApplicationEntity {
        return this.entity;
    }

    get customer(): CarSaleCustomerInterface | null {
        return this.entity.customer;
    }

    get customerId(): string {
        return this.entity.customerId;
    }

    get customerPhone(): string {
        return this.entity.customerPhone;
    }

    get publicationDate(): Date {
        return this.entity.publicationDate;
    }

    get sequenceNumber(): number {
        return this.entity.sequenceNumber;
    }

    get applicationId(): string {
        return this.entity.applicationId;
    }

    get applicationProposals(): ApplicationProposalInterface[] | null {
        return this.entity.applicationProposals;
    }
}
