import { OmitType } from '@nestjs/swagger';
import { AppConfigCreatePayload } from '@app/domains';
import { AppConfigDomainDto } from './app-config-domain.dto';

export class AppConfigCreateRequestDto extends OmitType(AppConfigDomainDto, ['createdAt', 'updatedAt']) implements AppConfigCreatePayload<{}> {
}
