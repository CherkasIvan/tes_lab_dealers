import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsPositive, IsEnum, IsString } from 'class-validator';
import { DealerOfficeVehiclesFullRequestDto } from './dealer-office-vehicles-full.request.dto';

export class DealerOfficeVehiclesFullPaginationRequestDto extends DealerOfficeVehiclesFullRequestDto {
    @ApiProperty({ description: 'Номер страницы начиная с 0', type: 'number', required: false })
    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    @Type(() => Number)
    page = 0;

    @ApiProperty({ description: 'Элементов на странице', type: 'number', required: false })
    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    @Type(() => Number)
    onPage = 15;

    @ApiProperty({ description: 'Порядок сортировки', required: false, enum: ['asc', 'desc'] })
    @IsString()
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sortDirection?: 'asc' | 'desc';

    @ApiProperty({ description: 'Название поля для сортировки', required: false })
    @IsString()
    @IsOptional()
    sortField?: string;
}
