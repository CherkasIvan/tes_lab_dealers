import { DealerOfficeGeozone } from './dealer-office-geozone.interface';

export interface DealerOffice {
    name: string;
    sapCode: string;
    city: string;
    parentSapCode: string;
    totalSales: number;
    geozone: DealerOfficeGeozone | null;
}
