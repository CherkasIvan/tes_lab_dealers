import { PaginationRequestQueryDto, SortingRequestQueryDto } from '@app/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetApplicationsDto extends IntersectionType(PaginationRequestQueryDto, SortingRequestQueryDto) {
    @ApiProperty({ description: 'Время жизни заявок' })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    activeHours = 0;
}
