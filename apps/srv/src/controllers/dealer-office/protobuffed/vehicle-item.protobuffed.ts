import { Field, Message, Type } from 'protobufjs';
import { DealersVehicleDataUpdateInterface, LocalizedPropertyInterface, VehicleFullModelInterface } from '@mobility/apps-dto';
import { NamedPropertyInterface } from '@mobility/apps-dto/dist/services/dealers';

@Type.d('LocalizedProperty')
export class LocalizedProperty extends Message<LocalizedProperty> implements LocalizedPropertyInterface {
    @Field.d(1, 'string')
    en!: string;
    @Field.d(2, 'string')
    ru!: string;
}

@Type.d('NamedProperty')
export class NamedProperty extends Message<NamedProperty> implements NamedPropertyInterface {
    @Field.d(1, 'string', 'optional')
    code!: string | null;
    @Field.d(2, 'string', 'optional')
    color!: string | null;
    @Field.d(3, 'string')
    name!: string;
}

@Type.d('DataUpdate')
export class DataUpdate extends Message<DataUpdate> implements DealersVehicleDataUpdateInterface {
    @Field.d(1, 'bool')
    canUpdate!: boolean;
    @Field.d(2, NamedProperty)
    source!: NamedPropertyInterface;
    @Field.d(3, 'string', 'optional')
    updatedAt!: string | null;
}

@Type.d('Location')
export class Location extends Message<Location> {
    @Field.d(1, 'double')
    lat!: number;
    @Field.d(2, 'double')
    lon!: number;
}

@Type.d('VehicleItemProtobuffed')
export class VehicleItemProtobuffed extends Message<VehicleItemProtobuffed> implements VehicleFullModelInterface {
    @Field.d(1, 'string')
    activationDate!: string;
    @Field.d(2, 'string', 'optional')
    address!: string | null;
    @Field.d(3, 'string', 'optional')
    addressUpdateDate!: string | null;
    @Field.d(4, 'int32', 'optional')
    assessedPrice!: number | null;
    @Field.d(5, LocalizedProperty)
    bodyType!: LocalizedPropertyInterface;
    @Field.d(6, NamedProperty)
    brand!: NamedPropertyInterface;
    @Field.d(7, LocalizedProperty)
    countryManufacturerName!: LocalizedPropertyInterface;
    @Field.d(8, DataUpdate, 'repeated')
    dataUpdates!: DealersVehicleDataUpdateInterface[];
    @Field.d(9, 'string')
    dealerOfficeName!: string;
    @Field.d(10, 'string')
    dealerOfficeSapCode!: string;
    @Field.d(11, NamedProperty)
    deviceType!: NamedPropertyInterface;
    @Field.d(12, 'int32', 'optional')
    doorsCount!: number | null;
    @Field.d(13, NamedProperty)
    driveType!: NamedPropertyInterface;
    @Field.d(14, 'int32', 'optional')
    drivingStyle!: number | null;
    @Field.d(15, 'string')
    engineName!: string;
    @Field.d(16, 'string')
    engineVolumeCm!: string;
    @Field.d(17, 'string')
    engineVolumeL!: string;
    @Field.d(18, 'string')
    equipmentName!: string;
    @Field.d(19, LocalizedProperty)
    euroClassName!: LocalizedPropertyInterface;
    @Field.d(20, 'string', 'optional')
    firstRegistrationDate!: string | null;
    @Field.d(21, 'float')
    fuelConsCity!: number;
    @Field.d(22, 'float')
    fuelConsHw!: number;
    @Field.d(23, 'float')
    fuelConsumption!: number;
    @Field.d(24, LocalizedProperty)
    fuelType!: LocalizedPropertyInterface;
    @Field.d(25, NamedProperty)
    fullModelName!: NamedPropertyInterface;
    @Field.d(26, LocalizedProperty)
    generation!: LocalizedPropertyInterface;
    @Field.d(27, 'string', 'optional')
    getLastPacketDate!: string | null;
    @Field.d(28, 'string')
    issueYear!: string;
    @Field.d(29, 'string', 'optional')
    lastPacketSendDate!: string | null;
    @Field.d(30, 'string')
    lastRegistrationAddress!: string;
    @Field.d(31, 'string', 'optional')
    lastRegistrationDate!: string | null;
    @Field.d(32, Location, 'optional')
    location!: { lat: number; lon: number } | null;
    @Field.d(33, 'float', 'optional')
    mileage!: number | null;
    @Field.d(34, NamedProperty)
    modelName!: NamedPropertyInterface;
    @Field.d(35, LocalizedProperty)
    modificationName!: LocalizedPropertyInterface;
    @Field.d(36, 'float', 'optional')
    motoHours!: number | null;
    @Field.d(37, 'int32')
    owners!: number;
    @Field.d(38, 'string')
    parentDealerSapCode!: string;
    @Field.d(39, 'float')
    power!: number;
    @Field.d(40, 'string', 'repeated')
    promoImages!: string[];
    @Field.d(41, 'string')
    retailDate!: string;
    @Field.d(42, 'string', 'optional')
    sapRetailDate!: string | null;
    @Field.d(43, NamedProperty)
    status!: NamedPropertyInterface;
    @Field.d(44, 'float', 'optional')
    tankCapacity!: number | null;
    @Field.d(45, 'string')
    transmissionType!: string;
    @Field.d(46, NamedProperty)
    typeOfOwners!: NamedPropertyInterface;
    @Field.d(47, 'string')
    vin!: string;
    @Field.d(48, 'float', 'optional')
    voltage!: number | null;
    @Field.d(49, 'string', 'optional')
    warrantyStartDate!: string | null;
    @Field.d(50, 'int32', 'optional')
    angle!: number | null;
    @Field.d(51, 'float', 'optional')
    averageSpeed!: number | null;
}

@Type.d('VehicleArrayProtobuffed')
export class VehicleArrayProtobuffed extends Message<VehicleArrayProtobuffed> {
    @Field.d(1, VehicleItemProtobuffed, 'repeated')
    vehicles!: VehicleFullModelInterface[];
}
