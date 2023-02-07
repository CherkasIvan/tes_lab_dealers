import { Injectable } from '@nestjs/common';
import { AutostatMap } from './interfaces/autostat-map.interface';
import { AUTOSTAT_DATA_MAP } from './consts/autostat-data-map.const';
import { AUTOSTAT_PRICE_MAP } from './consts/autostat-price-map.const';
import { Autostat } from './autostat.interfaces';
import { AutostatVehicleInterface } from './interfaces/autostat-vehicle.interface';

@Injectable()
export class AutostatMapperService {
    public getDomain(data: Autostat.ParsedResponse, price: Autostat.ParsedResponse): Partial<AutostatVehicleInterface> {
        return {
            ...this.transform(data, AUTOSTAT_DATA_MAP),
            ...this.transform(price, AUTOSTAT_PRICE_MAP),
        };
    }

    protected transform(autostatObject: Autostat.ParsedResponse, map: AutostatMap): Partial<AutostatVehicleInterface> {
        if (autostatObject.cellSet.length === 0) {
            return {};
        }

        const headerIndexes: Record<string, number> = {};

        autostatObject.headers.COLUMNS.forEach((column, index) => {
            if (Object.keys(map).includes(column.value)) {
                const key = map[column.value];
                headerIndexes[key] = index;
            }
        });

        const cellSet = autostatObject.cellSet[0];
        const result: Partial<AutostatVehicleInterface> = {};

        for (const key in headerIndexes) {
            const index = headerIndexes[key];
            const value = cellSet[index];

            if (!!value && value !== '') {
                result[key as keyof AutostatVehicleInterface] = cellSet[index];
            }
        }

        return result;
    }
}
