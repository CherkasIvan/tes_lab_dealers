import { DealerOfficeGeozone } from '../interfaces/dealer-office-geozone.interface';

export class DealerOfficeModel {
    id?: string;
    name!: string;
    sapCode!: string;
    city!: string;
    parentSapCode!: string;
    totalSales!: number;
    geozone!: DealerOfficeGeozone | null;

    constructor(model: DealerOfficeModel) {
        Object.assign(this, model);
    }
}
