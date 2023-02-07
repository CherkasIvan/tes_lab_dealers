import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetApplicationsDto {
    @ApiProperty({ description: 'Время жизни заявок' })
    @Type(() => Number)
    @IsNumber()
    activeHours = 0;
}
