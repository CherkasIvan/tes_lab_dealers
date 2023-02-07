import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationRequestQueryDto, SortingRequestQueryDto } from '@app/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppConfigSorting } from '@app/domains';

export class AppConfigsGetRequestDto extends IntersectionType(PaginationRequestQueryDto, SortingRequestQueryDto) {
    @ApiProperty({ description: 'Поле сортировки', enum: ['group', 'type', 'ident', 'createdAt', 'updatedAt'], required: false })
    @IsEnum(['group', 'type', 'ident', 'createdAt', 'updatedAt'])
    @IsString()
    @IsOptional()
    sortField?: AppConfigSorting['field'];
}
