import { AppConfigEntity } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class AppConfigDomainDto implements AppConfigEntity<{}> {
    @ApiProperty({ description: 'Название конфига', type: 'string', example: 'Доступы к провайдеру' })
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name = '';

    @ApiProperty({ description: 'Группа конфига', type: 'string', example: 'some-provider' })
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    group = '';

    @ApiProperty({ description: 'Тип конфига', type: 'string', example: 'credentials' })
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    type = '';

    @ApiProperty({ description: 'Уникальный код конфига', type: 'string', example: 'some-provider-credentials' })
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    ident = '';

    @ApiProperty({ description: 'Значение конфига', type: 'object', example: { login: 'some-login' } })
    @IsObject()
    @IsDefined()
    value: object = {};

    @ApiProperty({ description: 'Дата добавления конфига', type: 'string', example: '2022-01-01T00:00:00Z' })
    @IsDateString()
    @IsDefined()
    createdAt = '';

    @ApiProperty({ description: 'Дата обновления конфига', type: 'string', example: '2022-01-01T00:00:00Z' })
    @IsDateString()
    @IsDefined()
    updatedAt = '';
}
