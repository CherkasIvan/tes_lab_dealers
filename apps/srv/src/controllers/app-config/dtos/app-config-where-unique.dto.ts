import { AppConfigWhereUnique } from '@app/domains';
import { PickType } from '@nestjs/swagger';
import { AppConfigDomainDto } from './app-config-domain.dto';

export class AppConfigWhereUniqueDto extends PickType(AppConfigDomainDto, ['ident']) implements AppConfigWhereUnique {}
