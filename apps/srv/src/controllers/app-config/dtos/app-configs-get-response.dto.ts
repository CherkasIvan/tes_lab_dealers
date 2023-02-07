import { AppConfigDomainDto } from './app-config-domain.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppConfigsGetResponseDto {
    @ApiProperty({ description: 'Список конфигов', type: [AppConfigDomainDto] })
    rows: AppConfigDomainDto[] = [];

    @ApiProperty({ description: 'Общее кол-во по фильтру', type: 'number' })
    total = 0;
}
