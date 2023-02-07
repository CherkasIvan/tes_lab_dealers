import { AutostatReport } from '../interfaces/autostat-report';
import { ObjectId } from 'mongodb';

export class AutostatReportModel implements AutostatReport {
    _id!: ObjectId;
    bodyType = '';
    country = '';
    doorCount = '';
    engineVolumeCm = '';
    engineVolumeL = '';
    euroClass = '';
    firstRegistrationDate = '';
    fuelType = '';
    gearingType = '';
    generation = '';
    horsePower = '';
    lastOwnerType = '';
    lastRegistrationDate = '';
    lastRegistrationRegion = '';
    manufacture = '';
    model = '';
    ownerCount = '';
    price = '';
    steeringWheelLocation = '';
    transmissionsType = '';
    updatedAt: Date = new Date();
    vin = '';
    yearOfProduction = '';
    raw = {};
    createdAt = new Date();

    constructor(model: Partial<AutostatReport> & Pick<AutostatReportModel, 'vin'>) {
        Object.assign(this, model);
    }
}
