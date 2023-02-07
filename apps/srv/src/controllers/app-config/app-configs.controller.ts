import { Controller, Get, Query } from '@nestjs/common';
import { AppConfigFacade } from '@app/domains';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppConfigsGetRequestDto, AppConfigsGetResponseDto } from './dtos';

@ApiTags('configs')
@Controller('configs')
export class AppConfigsController {
    constructor(
        private readonly facade: AppConfigFacade
    ) {
    }

    @ApiOperation({ summary: 'Поиск/получение списка конфигов' })
    @ApiOkResponse({ type: AppConfigsGetResponseDto })
    @Get('')
    find(
        @Query() query: AppConfigsGetRequestDto
    ): Promise<AppConfigsGetResponseDto> {
        return this.facade.find({
            pagination: {
                onPage: query.onPage,
                page: query.page,
            },
            sorting: {
                field: query.sortField,
                direction: query.sortDirection,
            },
        });
    }
}
