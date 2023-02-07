import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppConfigFacade } from '@app/domains';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    AppConfigCreateRequestDto, AppConfigDomainDto,
    AppConfigUpdateRequestDto,
    AppConfigWhereUniqueDto,
} from './dtos';

@ApiTags('configs')
@Controller('config')
export class AppConfigController {
    constructor(
        private readonly facade: AppConfigFacade
    ) {
    }

    @ApiOperation({ summary: 'Добавление конфига' })
    @Post()
    create(@Body() payload: AppConfigCreateRequestDto): Promise<void> {
        return this.facade.create(payload);
    }

    @ApiOperation({ summary: 'Обновление конфига' })
    @Put(':ident')
    update(
        @Param() where: AppConfigWhereUniqueDto,
        @Body() payload: AppConfigUpdateRequestDto
    ): Promise<void> {
        return this.facade.update(where, payload);
    }

    @ApiOperation({ summary: 'Удаление конфига' })
    @Delete(':ident')
    delete(@Param() where: AppConfigWhereUniqueDto): Promise<void> {
        return this.facade.delete(where);
    }

    @ApiOperation({ summary: 'Получение конфига' })
    @ApiOkResponse({ type: AppConfigDomainDto })
    @Get(':ident')
    get(@Param() where: AppConfigWhereUniqueDto): Promise<AppConfigDomainDto> {
        return this.facade.get(where);
    }
}
