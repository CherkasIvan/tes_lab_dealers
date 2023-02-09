import {
    Body,
    Controller,
    Get,
    NotImplementedException,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
    DealersControllersEnum,
    DealersDealerOfficeCarReportsV2PostEndpoint,
    DealersDealerOfficeDealersGetEndpoint,
    DealersDealerOfficeGeozonesGetEndpoint,
    DealersDealerOfficeGeozonesGetV2Endpoint,
    DealersDealerOfficeOfficeListGetEndpoint,
    DealersDealerOfficeVehiclesFullGetEndpoint,
    DealersDealerOfficeVehiclesGetEndpoint,
    DealersDealerOfficeVehiclesVehicleGetEndpoint,
} from '@mobility/apps-dto/dist/services/dealers';
import { DealerOfficeControllerService } from './dealer-office-controller.service';
import { DealerOfficeVehiclesListRequestDto } from './dtos/dealer-office-vehicles-list.request.dto';
import { WrapResponseInterceptor } from '@app/common/interceptors/common-response-wrapper.interceptor';
import { DealerOfficeVehiclesFullRequestDto } from './dtos/dealer-office-vehicles-full.request.dto';
import { DealersDealerOfficeVehiclesUpdateSourcePostEndpoint } from '@mobility/apps-dto';
import { DealerOfficeUpdateSourceRequestDto } from './dtos/dealer-office-update-source.request.dto';
import { DealerOfficeCarReportsRequestDto } from './dtos/dealer-office-car-reports.request.dto';
import { DealersDealerOfficeCarReportsPostEndpoint } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dealers-dealer-office-car-reports-post.endpoint';
import { DealersDealerOfficeGeozoneUpdateEndpoint } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dealers-dealer-office-geozone-update.endpoint';
import { DealerOfficeCarReportsRequestQeryParamsDto } from './dtos/dealer-office-geozone-update.request.dto';
import { DealerOfficeGetGeozonesRequestQueryParamsDto } from './dtos/dealer-office-get-geozones.request.dto';
import { DealerOfficeCarReportsV2RequestDto } from './dtos/dealer-office-car-reports-v2.request.dto';
import { DealerOfficeGeozone } from '../../modules/dealers/interfaces/dealer-office-geozone.interface';
import { DealerOfficeVehiclesFullPaginationRequestDto } from './dtos/dealer-office-vehicles-full-pagination.request.dto';

@UseInterceptors(WrapResponseInterceptor)
@ApiTags(DealersControllersEnum.DealerOffice)
@Controller(DealersControllersEnum.DealerOffice)
export class DealerOfficeController {
    constructor(private readonly controllerService: DealerOfficeControllerService) {}

    @ApiOperation({ summary: 'Получение полного списка автомобилей дилера с пагинацией/фильтрацией/сортировкой' })
    @Get(DealersDealerOfficeVehiclesFullGetEndpoint.endPointPath + '-pagination')
    async getAllVehiclesPagination(
        @Query() query: DealerOfficeVehiclesFullPaginationRequestDto,
    ): Promise<DealersDealerOfficeVehiclesFullGetEndpoint.ResponseData | void> {
        return this.controllerService.getAllDealerVehiclesPagination(query);
    }

    @ApiOperation({ summary: 'Просмотр автомобиля' })
    @Get(DealersDealerOfficeVehiclesVehicleGetEndpoint.endPointPath)
    getVehicle(@Param('vin') vin: string): Promise<DealersDealerOfficeVehiclesVehicleGetEndpoint.ResponseData> {
        return this.controllerService.getVehicleInfo(vin);
    }

    @ApiOperation({ summary: 'Получение списка офисов дилера' })
    @ApiParam({ name: 'dealerId', description: 'sapCode дилера' })
    @Get(DealersDealerOfficeOfficeListGetEndpoint.endPointPath)
    getSubDealers(@Param('dealerId') parentId: string): Promise<DealersDealerOfficeOfficeListGetEndpoint.ResponseData> {
        return this.controllerService.getDealerOffices(parentId);
    }

    @ApiOperation({ summary: 'Получение полного списка автомобилей дилера' })
    @Get(DealersDealerOfficeVehiclesFullGetEndpoint.endPointPath)
    async getAllVehicles(
        @Query() query: DealerOfficeVehiclesFullRequestDto,
    ): Promise<DealersDealerOfficeVehiclesFullGetEndpoint.ResponseData | void> {
        return this.controllerService.getAllDealerVehicles(query);
    }

    @ApiOperation({ summary: 'Получение списка дилеров' })
    @Get(DealersDealerOfficeDealersGetEndpoint.endPointPath)
    getDealersList(): Promise<DealersDealerOfficeDealersGetEndpoint.ResponseData> {
        return this.controllerService.getDealers();
    }

    @ApiOperation({ summary: 'Обновление источника данных авто' })
    @Post(DealersDealerOfficeVehiclesUpdateSourcePostEndpoint.endPointPath)
    async updateSource(@Body() body: DealerOfficeUpdateSourceRequestDto): Promise<void> {
        return this.controllerService.updateSource(body);
    }

    @ApiOperation({ summary: 'Получение полного списка геозон дилерских центров' })
    @Get(DealersDealerOfficeGeozonesGetEndpoint.endPointPath)
    async getGeozones(): Promise<DealersDealerOfficeGeozonesGetEndpoint.ResponseData> {
        return {
            geozones: [],
        };
    }

    @ApiOperation({ summary: 'Получение полного списка геозон дилерских центров' })
    @Get(DealersDealerOfficeGeozonesGetV2Endpoint.endPointPath)
    async getGeozonesV2(@Query() query: DealerOfficeGetGeozonesRequestQueryParamsDto): Promise<DealersDealerOfficeGeozonesGetV2Endpoint.ResponseData> {
        return this.controllerService.getGeozones(query);
    }

    @ApiOperation({ summary: 'Получение списка отчетов по геозонам для автомобилей' })
    @Get(DealersDealerOfficeCarReportsPostEndpoint.endPointPath)
    async getCarReports(@Query() query: DealerOfficeCarReportsRequestDto): Promise<DealersDealerOfficeCarReportsPostEndpoint.ResponseData> {
        return {
            reports: [],
        };
    }

    @ApiOperation({ summary: 'Получение списка отчетов по геозонам для автомобилей' })
    @Get(DealersDealerOfficeCarReportsV2PostEndpoint.endPointPath)
    async getCarReportsV2(@Query() query: DealerOfficeCarReportsV2RequestDto): Promise<DealersDealerOfficeCarReportsV2PostEndpoint.ResponseData> {
        return this.controllerService.getCarReports(query);
    }

    @ApiOperation({ summary: 'Получение полного списка геозон дилерских центров' })
    @Put(DealersDealerOfficeGeozoneUpdateEndpoint.endPointPath)
    async updateDealerOfficeGeozone(
        @Query() query: DealerOfficeCarReportsRequestQeryParamsDto,
        @Body() body: unknown
    ) {
        return this.controllerService.updateDealerOfficeGeozone(query, body as DealerOfficeGeozone);
    }
}
