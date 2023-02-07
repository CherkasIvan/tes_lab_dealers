import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class BatchVinOperationRequestDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    vins: string[] = [];
}
