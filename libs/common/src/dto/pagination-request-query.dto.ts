import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestQueryDto {
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
}
