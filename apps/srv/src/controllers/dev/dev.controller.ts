import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DevControllerService } from './dev-controller.service';
import { DealerOfficeGeolocateManyRequestDto } from './dtos/dealer-office-geolocate-many.request.dto';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { BatchVinOperationRequestDto } from './dtos/batch-vin-operation.request.dto';
import { ForceOperationRequestDto } from './dtos/force-operation.request.dto';
import { CollectGeozoneEventsHistoryRequestDto } from './dtos/collect-geozone-events-history.request.dto';

@ApiTags('dev')
@Controller('dev')
export class DevController {
    constructor(private readonly service: DevControllerService) { }

    @ApiOperation({ summary: 'запустить геолокацию по выбранным машинам', deprecated: true })
    @Post('vehicles/geolocate-many')
    async geolocateMany(@Body() body: DealerOfficeGeolocateManyRequestDto): Promise<void> {
        return this.service.geolocateMany(body);
    }

    @ApiOperation({ deprecated: true })
    @Post('reaggregate')
    reaggregate(@Body() body: BatchVinOperationRequestDto): void {
        this.service.reaggregate(body.vins);
    }

    @ApiOperation({ deprecated: true })
    @Get('vehicles/:vin/last-packet')
    getLastPacket(@Param('vin') vin: string): Promise<unknown> {
        return this.service.getVehicleLastPacket(vin);
    }

    @ApiOperation({ deprecated: true })
    @Post('sync-vehicles')
    async testConnection(@Body() body: BatchVinOperationRequestDto): Promise<boolean> {
        if (body.vins.length) {
            this.service.updateLastPackets(body.vins);
        } else {
            this.service.updateLastPackets();
        }
        return true;
    }

    @ApiOperation({ deprecated: true })
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'csvdump', required: true })
    @UseInterceptors(FileInterceptor('csvdump'))
    @Post('from-csv')
    loadFromCsv(@UploadedFile() file: Express.Multer.File): Promise<unknown> {
        return this.service.loadDealersFromCsv(file.buffer);
    }

    @ApiOperation({ deprecated: true, summary: 'Загрузить данные из WA' })
    @Post('load-wa')
    loadFromWA(@Body() body: BatchVinOperationRequestDto): void {
        this.service.loadWAInfo(body.vins);
    }

    @ApiOperation({ deprecated: true, summary: 'Загрузить данные из OCN' })
    @Post('load-ocn')
    loadFromOCN(@Body() body: BatchVinOperationRequestDto): void {
        this.service.loadOcnInfo(body.vins);
    }

    @ApiOperation({ deprecated: true, summary: 'Загрузить связки simId-vin' })
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'csvdump', required: true })
    @UseInterceptors(FileInterceptor('csvdump'))
    @Post('load-vin-simid')
    loadDeviceIdCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
        return this.service.loadDeviceIdFromCsv(file.buffer);
    }

    @ApiOperation({ deprecated: true, summary: 'Загрузить устройства bluelink' })
    @Post('load-bluelink-devices')
    async syncBluelinkDevices(@Body() body: ForceOperationRequestDto): Promise<void> {
        this.service.syncBluelinkDevices(body.force);
    }

    @ApiOperation({ deprecated: true, summary: 'Загрузить последние пакеты bluelink' })
    @Post('load-bluelink-packets')
    async loadBluelinkPackets(@Body() body: BatchVinOperationRequestDto): Promise<void> {
        this.service.loadBluelinkPackets(body.vins);
    }

    @ApiOperation({ deprecated: true, summary: 'Запрос на сбор данных по въездам/выездам за прошлое' })
    @Post('collect-geozone-events')
    async collectEventsHistory(@Body() body: CollectGeozoneEventsHistoryRequestDto): Promise<void> {
        this.service.collectEventsHistory(body);
    }

    @ApiOperation({ deprecated: true, summary: 'Обновить данные по машинам' })
    @Post('update-vehicles')
    updateVehicles(@Body() body: BatchVinOperationRequestDto) {
        this.service.updateVehicles(body.vins);
    }
}
