import {
    IsArray,
    IsDefined,
    IsNumber,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectGeozoneEventsHistoryRequestDto {
    @ApiProperty()
    @IsDefined()
    @IsArray()
    @IsString({ each: true })
    deviceIds!: string[];
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    startAt!: number;
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    endAt!: number;
}
