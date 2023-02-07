import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import {
    DealersDealerOfficeCarReportsV2PostEndpoint,
    DealersDealerOfficeDealersGetEndpoint,
    DealersDealerOfficeGeozonesGetV2Endpoint,
    DealersDealerOfficeOfficeListGetEndpoint,
    DealersDealerOfficeVehiclesFullGetEndpoint,
    DealersDealerOfficeVehiclesVehicleGetEndpoint,
    DealersUncompressedVehiclesFullResponse,
} from '@mobility/apps-dto/dist/services/dealers';
import { InternalLogger } from '@app/common';
import { DealerOfficeVehiclesFullRequestDto } from './dtos/dealer-office-vehicles-full.request.dto';
import { DealersService } from '../../modules/dealers/dealers.service';
import { lastValueFrom, map, toArray } from 'rxjs';
import { DealersDealerListItem } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dtos/dealers-dealer-office-dealers.response.dto';
import { DealersDealerOfficeListItem } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dtos/dealers-dealer-office-office-list.response.dto';
import { mapToVehicleCard } from './response-mappers/vehicle-card.mapper';
import { DealerOfficeUpdateSourceRequestDto } from './dtos/dealer-office-update-source.request.dto';
import { DataSourceEnum } from '../../modules/dealers/enums';
import { AutostatService } from '../../modules/autostat/autostat.service';
import { FullVehicleModelMapper } from './response-mappers/full-vehicle-model.mapper';
import { BluelinkService } from '../../modules/bluelink/bluelink.service';
import { DealerOfficeCarReportsRequestQeryParamsDto } from './dtos/dealer-office-geozone-update.request.dto';
import { DealerOfficeGetGeozonesRequestQueryParamsDto } from './dtos/dealer-office-get-geozones.request.dto';
import { DealerOfficeCarReportsV2RequestDto } from './dtos/dealer-office-car-reports-v2.request.dto';
import { DealerOfficeGeozone } from '../../modules/dealers/interfaces/dealer-office-geozone.interface';
import { VehicleArrayProtobuffed } from './protobuffed/vehicle-item.protobuffed';

@Injectable()
export class DealerOfficeControllerService {
    constructor(
        private readonly dealerService: DealersService,
        private readonly autostatService: AutostatService,
        private readonly bluelinkService: BluelinkService,
    ) {}

    private readonly logger = new InternalLogger(DealerOfficeControllerService.name);

    getDealers(): Promise<DealersDealerOfficeDealersGetEndpoint.ResponseData> {
        return this.dealerService.getDealersList().then((dealers) => {
            return {
                dealers: dealers.map((dealer): DealersDealerListItem => {
                    return {
                        offices: dealer.offices.map((office) => ({
                            sapCode: office.sapCode,
                            name: { name: office.name },
                            totalSales: office.totalSales,
                            city: { name: office.city },
                            parentSapCode: office.parentSapCode,
                        })),
                        name: { name: dealer.name },
                        sapCode: dealer.sapCode,
                        totalSales: dealer.totalSales,
                    };
                }),
            };
        });
    }

    getDealerOffices(dealerSapCode: string): Promise<DealersDealerOfficeOfficeListGetEndpoint.ResponseData> {
        return this.dealerService.getSubDealers(dealerSapCode).then((dealerOffices) => {
            return {
                offices: dealerOffices.map(
                    (office): DealersDealerOfficeListItem => ({
                        sapCode: office.sapCode,
                        parentSapCode: office.parentSapCode,
                        name: { name: office.name },
                        totalSales: office.totalSales,
                        city: { name: office.city },
                    }),
                ),
            };
        });
    }

    async getAllDealerVehicles(
        query: DealerOfficeVehiclesFullRequestDto,
    ): Promise<DealersDealerOfficeVehiclesFullGetEndpoint.ResponseData> {
        const result: DealersUncompressedVehiclesFullResponse = await this.dealerService
            .getAllDealerVehicles({ dealerOfficeIds: query.dealerOffices, dealerSapCodes: query.dealers })
            .then((vehicles$) =>
                lastValueFrom(
                    vehicles$.pipe(
                        map((vehicle) => new FullVehicleModelMapper(vehicle).getResponseModel()),
                        toArray(),
                        map((vehicles) => ({
                            vehicles,
                        })),
                    ),
                ),
            );
        if (query.pack === 'csv-like') {
            if (!result.vehicles.length) {
                return {
                    headers: [],
                    rows: [],
                };
            }
            const sample = result.vehicles[0];
            const headers = Object.keys(sample);
            const rows = result.vehicles.map((item) => Object.values(item));
            return {
                headers,
                rows,
            };
        }
        if (query.pack === 'protobuf') {
            const response = new StreamableFile(
                VehicleArrayProtobuffed.encode(result).finish(),
            ) as unknown as DealersDealerOfficeVehiclesFullGetEndpoint.ResponseData;
            console.log(response);
            return response;
        }
        return result;
    }

    async getVehicleInfo(vin: string): Promise<DealersDealerOfficeVehiclesVehicleGetEndpoint.ResponseData> {
        const vehicle = await this.dealerService.getVehicle(vin);
        if (!vehicle) {
            throw new NotFoundException();
        }
        return mapToVehicleCard(vehicle);
    }

    async updateSource(body: DealerOfficeUpdateSourceRequestDto): Promise<void> {
        switch (body.source as DataSourceEnum) {
            case DataSourceEnum.Autostat:
                await this.autostatService.getDataByVin(body.vin);
                break;
            case DataSourceEnum.Mta:
                await this.dealerService.updateLastPacket(body.vin);
                break;
            case DataSourceEnum.Dadata:
                await this.dealerService.updateVehicleLocation(body.vin);
                break;
            case DataSourceEnum.Bluelink:
                await this.bluelinkService.getLastPacketInfo(body.vin, true);
        }
    }

    async getGeozones(query: DealerOfficeGetGeozonesRequestQueryParamsDto): Promise<DealersDealerOfficeGeozonesGetV2Endpoint.ResponseData> {
        return this.dealerService.getGeozones({ dealerOfficeIds: query.dealerOffices, dealerSapCodes: query.dealers });
    }

    async getCarReports(query: DealerOfficeCarReportsV2RequestDto): Promise<DealersDealerOfficeCarReportsV2PostEndpoint.ResponseData> {
        return this.dealerService.getCarReports(query);
    }

    async updateDealerOfficeGeozone(query: DealerOfficeCarReportsRequestQeryParamsDto, body: DealerOfficeGeozone) {
        return this.dealerService.updateDealerOfficeGeozone(query.dealerOffice, body);
    }
}
