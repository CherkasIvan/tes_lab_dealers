import { Vehicle } from '../../../modules/dealers/interfaces/vehicle';
import { DealersVehicleDataUpdateInterface, VehicleFullModelInterface } from '@mobility/apps-dto';
import { DataSourceEnum } from '../../../modules/dealers/enums';

export class FullVehicleModelMapper {
    constructor(private model: Vehicle) { }

    private getDataUpdates(): DealersVehicleDataUpdateInterface[] {
        const vehicle = this.model;
        return [
            {
                source: { code: DataSourceEnum.Mta, name: 'Телематика' },
                updatedAt: vehicle.getLastPacketUpdateDate()?.toISOString() || null,
                canUpdate: vehicle.isActivated() && vehicle.mtaDataAvailable(),
            },
            {
                source: { code: DataSourceEnum.Autostat, name: 'Автостат' },
                updatedAt: vehicle.autostatInfo?.updatedAt.toISOString() || null,
                canUpdate: true,
            },
            {
                source: { code: DataSourceEnum.Dadata, name: 'Геолокация авто' },
                updatedAt: vehicle.addressUpdatedAt?.toISOString() || null,
                canUpdate: false,
            },
        ];
    }

    // eslint-disable-next-line max-lines-per-function
    getResponseModel(): VehicleFullModelInterface {
        const vehicle = this.model;
        const bodyType = vehicle.autostatInfo?.bodyType || '';
        const manufacturerCountry = vehicle.autostatInfo?.country || '';

        return {
            vin: vehicle.vin,
            address: vehicle.address || '',
            voltage: vehicle.getVoltage(),
            engineName: vehicle.getEngineName(),
            bodyType: { ru: bodyType, en: bodyType },
            lastRegistrationAddress: vehicle.autostatInfo?.lastRegistrationRegion || '',
            mileage: vehicle.getMileage(),
            generation: { en: vehicle.getGenerationName(), ru: vehicle.getGenerationName() },
            engineVolumeL: vehicle.getEngineVolumeL(),
            issueYear: vehicle.getProductionYear(),
            engineVolumeCm: vehicle.getEngineVolumeCm(),
            dataUpdates: this.getDataUpdates(),
            euroClassName: { ru: vehicle.getEuroClass(), en: vehicle.getEuroClass() },
            fuelType: { ru: vehicle.getFuelType(), en: vehicle.getFuelType() },
            location: vehicle.getLocation(),
            fullModelName: { name: vehicle.fullModelName },
            brand: { name: vehicle.getBrand() },
            activationDate: vehicle.getActivationDate()?.toISOString() || '',
            assessedPrice: Number(vehicle.autostatInfo?.price) || 0,
            owners: Number(vehicle.autostatInfo?.ownerCount) || 0,
            typeOfOwners: { name: vehicle.autostatInfo?.lastOwnerType || '' },
            lastRegistrationDate: vehicle.autostatInfo?.lastRegistrationDate || '',
            firstRegistrationDate: vehicle.autostatInfo?.firstRegistrationDate || '',
            retailDate: vehicle.getRetailDate(),
            parentDealerSapCode: vehicle.dealer?.parentSapCode || '',
            power: vehicle.getPower(),
            modelName: { name: vehicle.model },
            status: { name: vehicle.getDeviceActiveStatus() },
            deviceType: { name: vehicle.deviceType },
            countryManufacturerName: { ru: manufacturerCountry, en: manufacturerCountry },
            dealerOfficeName: vehicle.dealer?.name || '',
            dealerOfficeSapCode: vehicle.dealer?.sapCode || '',
            doorsCount: Number(vehicle.autostatInfo?.doorCount) || 0,
            driveType: { name: vehicle.getDriveType() },
            drivingStyle: vehicle.getDrivingStyle(),
            getLastPacketDate: vehicle.getLastPacketDate()?.toISOString() || null,
            motoHours: vehicle.getMotoHours() || null,
            averageSpeed: vehicle.getAverageSpeed() || null,
            equipmentName: vehicle.getEquipmentName(),
            fuelConsCity: vehicle.getFuelConsumption().city,
            fuelConsHw: vehicle.getFuelConsumption().highway,
            fuelConsumption: vehicle.getFuelConsumption().mixed,
            addressUpdateDate: vehicle.addressUpdatedAt?.toISOString() || null,
            modificationName: { ru: vehicle.getModificationName(), en: vehicle.getModificationName() },
            promoImages: vehicle.getPromoImages(),
            sapRetailDate: vehicle.getSapRetailDate()?.toISOString() || null,
            tankCapacity: vehicle.getTankCapacity(),
            lastPacketSendDate: vehicle.getLastPacketSendDate()?.toISOString() || null,
            warrantyStartDate: vehicle.getWarrantyStartDate()?.toISOString() || null,
            transmissionType: vehicle.getTransmissionType(),
        };
    }
}
