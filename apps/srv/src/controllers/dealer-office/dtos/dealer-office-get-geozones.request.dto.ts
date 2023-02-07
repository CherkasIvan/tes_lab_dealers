import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
} from 'class-validator';
import { DealersDealerOfficeGeozonesGetV2Endpoint } from '@mobility/apps-dto/dist/services/dealers';
import { Transform } from 'class-transformer';

export class DealerOfficeGetGeozonesRequestQueryParamsDto implements DealersDealerOfficeGeozonesGetV2Endpoint.RequestQueryParams {
    [key: string]: string | number | undefined | string[];
    @ApiPropertyOptional()
    @IsOptional()
    @Transform((config) => (Array.isArray(config.value) ? config.value : [config.value]))
    @IsString({ each: true })
    dealerOffices?: string[];
    @ApiPropertyOptional()
    @IsOptional()
    @Transform((config) => (Array.isArray(config.value) ? config.value : [config.value]))
    @IsString({ each: true })
    dealers?: string[];
}
