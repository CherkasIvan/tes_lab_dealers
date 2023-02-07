import { DealersDealerOfficeVehiclesGetEndpoint } from '@mobility/apps-dto/dist/services/dealers';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DealerOfficeVehiclesListRequestDto implements DealersDealerOfficeVehiclesGetEndpoint.RequestQueryParams {
    [key: string]: string | number;

    @ApiProperty({ description: 'Количество сущностей на странице', default: 25 })
    @Type(() => Number)
    @IsNumber()
    onPage = 25;

    @ApiProperty({ description: 'Номер страницы', default: 0 })
    @Type(() => Number)
    @IsNumber()
    page = 0;
}
