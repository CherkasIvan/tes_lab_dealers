import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchRequestQueryDto {
    @ApiProperty({ description: 'Поиск', required: false })
    @IsString()
    @IsOptional()
    search?: string;
}
