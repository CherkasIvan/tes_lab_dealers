import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { DealersControllersEnum } from '@mobility/apps-dto/dist/services/dealers';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AutostatControllerService } from './autostat-controller.service';
import { DealersAutostatReportGetEndpoint, DealersAutostatReportPostEndpoint } from '@mobility/apps-dto/dist/services/dealers/autostat';
import { WrapResponseInterceptor } from '@app/common/interceptors/common-response-wrapper.interceptor';
import { AutostatRequestMultipleRequestDto } from './dtos/autostat-request-multiple.request.dto';

@UseInterceptors(WrapResponseInterceptor)
@ApiTags(DealersControllersEnum.Autostat)
@Controller(DealersControllersEnum.Autostat)
export class AutostatController {
    constructor(private readonly controllerService: AutostatControllerService) {}

    @ApiOperation({ summary: 'Запросить отчет автостата' })
    @Get(DealersAutostatReportGetEndpoint.endPointPath)
    getAutostatReport(@Param('vin') vin: string): Promise<DealersAutostatReportGetEndpoint.ResponseData> {
        return this.controllerService.getAutostatReport(vin);
    }

    @ApiOperation({ summary: 'Синхронизировать несколько отчетов автостата', deprecated: true })
    @Post(DealersAutostatReportPostEndpoint.endPointPath)
    async requestMultipleReports(@Body() body: AutostatRequestMultipleRequestDto): Promise<DealersAutostatReportPostEndpoint.ResponseData> {
        return this.controllerService.requestMultipleReports(body.vins);
    }
}
