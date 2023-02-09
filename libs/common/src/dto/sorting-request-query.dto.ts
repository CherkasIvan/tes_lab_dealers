import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SortingRequestQueryDto {
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
