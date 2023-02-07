import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
    BluelinkBasicInfoResponseInterface,
    BluelinkBasicInfoType,
    BluelinkGpsInfoResponseInterface,
    BluelinkGpsInfoType,
    BluelinkVehicleStatusResponseInterface,
    BluelinkVehicleStatusType,
} from './interfaces';
import { BluelinkConfigService } from './bluelink-config.service';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { InternalLogger } from '@app/common/logger';

@Injectable()
export class BluelinkQueryService {
    constructor(private readonly httpService: HttpService, private readonly configService: BluelinkConfigService) {}

    private readonly logger = new InternalLogger(BluelinkQueryService.name);

    async getGpsInfo(vin: string): Promise<BluelinkGpsInfoType | null> {
        const config = await this.configService.get();
        const url = `${config.url}/gpsinfo`;
        return lastValueFrom(
            this.httpService
                .post<BluelinkGpsInfoResponseInterface>(url, null, {
                    headers: {
                        VIN: vin,
                        Brand: config.brandHeader,
                        Host: config.hostHeader,
                    },
                })
                .pipe(
                    map(({ data }) => data.gpsinfo),
                    catchError((err) => {
                        return of(null);
                    }),
                ),
        );
    }

    async getBasicInfo(vin: string): Promise<BluelinkBasicInfoType | null> {
        const config = await this.configService.get();
        const url = `${config.url}/basicinfo`;
        const brandHeader = config.brandHeader;
        return lastValueFrom(
            this.httpService.post<BluelinkBasicInfoResponseInterface>(url, { vins: [vin] }, { headers: { Brand: brandHeader } }).pipe(
                map(({ data }) => data.basicinfo[0]),
                catchError((err) => {
                    return of(null);
                }),
            ),
        );
    }

    async getVehicleStatus(vin: string): Promise<BluelinkVehicleStatusType | null> {
        const config = await this.configService.get();
        const url = `${config.url}/vehicleStatus`;
        const brandHeader = config.brandHeader;
        return lastValueFrom(
            this.httpService
                .post<BluelinkVehicleStatusResponseInterface>(url, null, {
                    headers: {
                        VIN: vin,
                        Brand: brandHeader,
                    },
                })
                .pipe(
                    map(({ data }) => data.vehicleStatus),
                    catchError((err) => {
                        return of(null);
                    }),
                ),
        );
    }
}
