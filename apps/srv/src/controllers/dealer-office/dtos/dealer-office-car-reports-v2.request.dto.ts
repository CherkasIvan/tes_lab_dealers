import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import {
    IsDefined,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { DealersDealerOfficeCarReportsV2PostEndpoint } from '@mobility/apps-dto/dist/services/dealers';

export class DealerOfficeCarReportsV2RequestDto implements DealersDealerOfficeCarReportsV2PostEndpoint.RequestQueryParams {
    [key: string]: string | number | string[] | undefined;
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
    @IsOptional()
    @Transform((config) => (parseInt(config.value)))
    @IsNumber()
    minTimeSpend?: number;
    @ApiProperty()
    @IsDefined()
    @Transform((config) => (parseInt(config.value)))
    @IsNumber()
    dateStart!: number;
    @ApiPropertyOptional()
    @IsOptional()
    @Transform((config) => (parseInt(config.value)))
    @IsNumber()
    dateEnd?: number;
}
