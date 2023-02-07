import { DealersDealerOfficeVehiclesFullGetEndpoint } from '@mobility/apps-dto/dist/services/dealers';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DealerOfficeVehiclesFullRequestDto implements DealersDealerOfficeVehiclesFullGetEndpoint.RequestQueryParams {
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

    @ApiPropertyOptional()
    @IsIn(['uncompressed', 'csv-like', 'protobuf'])
    @IsOptional()
    pack: 'uncompressed' | 'csv-like' | 'protobuf' = 'uncompressed';
}
