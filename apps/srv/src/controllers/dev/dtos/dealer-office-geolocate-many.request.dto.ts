import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DealerOfficeGeolocateManyRequestDto {
    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    vins!: string[];
}
