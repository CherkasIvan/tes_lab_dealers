import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CarSaleControllerService } from './car-sale-controller.service';
import { WrapResponseInterceptor } from '@app/common/interceptors/common-response-wrapper.interceptor';
import { DealersCarSaleActiveApplicationsPostEndpoint, DealersCarSaleActiveApplicationsGetEndpoint, DealersControllersEnum } from '@mobility/apps-dto/dist/services/dealers';
import { GetApplicationsDto } from './dtos/get-applications.dto';
import { ApplicationProposalRequestDto } from '../../modules/car-sale/dto/application-proposal.request.dto';
import { ApplicationProposalInterface } from '../../modules/car-sale/interfaces/application-proposal.interface';

@UseInterceptors(WrapResponseInterceptor)
@ApiTags(DealersControllersEnum.CarSale)
@Controller(DealersControllersEnum.CarSale)
export class CarSaleController {
    constructor(private readonly service: CarSaleControllerService) { }

    @ApiQuery({ name:'page', type: 'number' })
    @ApiQuery({ name:'onPage', type: 'number' })
    @ApiOperation({ summary: 'Получение всех заявок на выкуп' })
    @Get(DealersCarSaleActiveApplicationsGetEndpoint.endPointPath)
    getActiveApplications(@Query() query: GetApplicationsDto): Promise<DealersCarSaleActiveApplicationsGetEndpoint.ResponseData> {
        const { activeHours, page, onPage, sortDirection, sortField  } = query;
        console.log('some Dto' + ' ' + typeof sortDirection);
        return this.service.getActiveApplications(activeHours, page, onPage, sortDirection || 'asc', sortField || 'vin');
    }

    @ApiOperation({ summary: 'Ответ на заявку' })
    @Post(DealersCarSaleActiveApplicationsPostEndpoint.endPointPath)
    addApplicationResponse(@Param('applicationId') applicationId: string, @Body() body: ApplicationProposalRequestDto): Promise<ApplicationProposalInterface[]> {
        return this.service.addApplicationResponse(applicationId, body);
    }
}
