import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DealersDealerOfficeCarReportsPostEndpoint } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dealers-dealer-office-car-reports-post.endpoint';
import { Transform } from 'class-transformer';

export class DealerOfficeCarReportsRequestDto implements DealersDealerOfficeCarReportsPostEndpoint.RequestQueryParams {
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
}
