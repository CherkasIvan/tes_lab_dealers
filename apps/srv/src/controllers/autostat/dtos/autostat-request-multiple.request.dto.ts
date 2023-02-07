import { DealersAutostatReportPostEndpoint } from '@mobility/apps-dto/dist/services/dealers/autostat';
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutostatRequestMultipleRequestDto implements DealersAutostatReportPostEndpoint.RequestBody {
    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    vins!: string[];
}
