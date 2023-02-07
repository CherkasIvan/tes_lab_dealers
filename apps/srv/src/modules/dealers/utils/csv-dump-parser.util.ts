import { Injectable } from '@nestjs/common';
import { CsvDumpEntryInterface } from '../interfaces/csv-dump-entry.interface';
import { DealerModel, DealerVehicleModel, VehicleModel } from '../models';
import * as moment from 'moment';
import { DealerOfficeModel } from '../models/dealer-office.model';

@Injectable()
export class CsvDumpParserUtil {
    private strToDate(dateString: string): Date {
        if (/(\d{1,2}-\w{3}-\d{2})/.test(dateString)) {
            return moment(dateString, 'DD-MMM-YY').toDate();
        }
        return moment(dateString, 'MM/DD/YYYY').toDate();
    }

    private createDealerModel(entry: CsvDumpEntryInterface): DealerModel {
        return new DealerModel({
            name: entry.Name_of_HeadOffice,
            sapCode: entry.Delaer_HO_code,
            totalSales: 0,
        });
    }

    private createDealerOfficeModel(entry: CsvDumpEntryInterface): DealerOfficeModel {
        return new DealerOfficeModel({
            parentSapCode: entry.Delaer_HO_code,
            totalSales: 0,
            name: entry.Branch_Name,
            sapCode: entry.Branch_code,
            city: entry.City,
            geozone: null,
        });
    }

    private createVehicle(entry: CsvDumpEntryInterface): VehicleModel {
        return new VehicleModel({
            activationDate: this.strToDate(entry.MobiKeyActivateDate),
            deviceActiveStatus: entry.MobiKeyStatus,
            deviceType: entry.MobiKeyType,
            fullModelName: entry.Car_Desc,
            vin: entry.VIN,
            retailDate: this.strToDate(entry.Retail_Date),
            model: entry.Car_Line_Desc,
            simId: null,
            address: null,
            addressUpdatedAt: null,
            lastPacketRef: null,
            dealerOfficeRef: null,
            autostatReportRef: null,
            dealerRef: null,
            vehicleRelationRef: null,
            waInfoRef: null,
            ocnInfoRef: null,
            ocn: null,
            updatedAt: null,
            activationChangedAt: null,
        });
    }

    parseCsvEntries(entries: CsvDumpEntryInterface[]): {
        dealers: DealerModel[];
        dealerOffices: DealerOfficeModel[];
        vehicles: VehicleModel[];
        relations: DealerVehicleModel[];
    } {
        const dealersMap = new Map<string, DealerModel>();
        const dealerCenters = new Map<string, DealerOfficeModel>();
        const dealerSales = new Map<string, number>();
        const dealerCenterSales = new Map<string, number>();
        const vehicles: VehicleModel[] = [];
        const relations: DealerVehicleModel[] = [];
        for (const entry of entries) {
            const dealer = this.createDealerModel(entry);
            if (!dealersMap.has(dealer.sapCode)) {
                dealersMap.set(dealer.sapCode, dealer);
                dealerSales.set(dealer.sapCode, 0);
            }

            const dealerOffice = this.createDealerOfficeModel(entry);
            if (!dealerCenters.has(dealerOffice.sapCode)) {
                dealerCenters.set(dealerOffice.sapCode, dealerOffice);
                dealerCenterSales.set(dealerOffice.sapCode, 0);
            }
            vehicles.push(this.createVehicle(entry));
            dealerSales.set(dealer.sapCode, (dealerSales.get(dealer.sapCode) || 0) + 1);
            dealerCenterSales.set(dealerOffice.sapCode, (dealerCenterSales.get(dealerOffice.sapCode) || 0) + 1);
            relations.push({ dealerOfficeSapCode: dealerOffice.sapCode, vin: entry.VIN, dealerSapCode: dealer.sapCode });
        }
        for (const key of dealerSales.keys()) {
            const dealer = dealersMap.get(key)!;
            dealer.totalSales += dealerSales.get(key)!;
            dealersMap.set(key, dealer);
        }

        for (const key of dealerCenterSales.keys()) {
            const dealerCenter = dealerCenters.get(key)!;
            dealerCenter.totalSales += dealerCenterSales.get(key)!;
            dealerCenters.set(key, dealerCenter);
        }

        return {
            vehicles,
            dealers: Array.from(dealersMap.values()),
            dealerOffices: Array.from(dealerCenters.values()),
            relations,
        };
    }
}
