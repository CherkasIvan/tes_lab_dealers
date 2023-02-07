import { OmitType, PartialType } from '@nestjs/swagger';
import { AppConfigCreateRequestDto } from './app-config-create-request.dto';
import { AppConfigUpdatePayload } from '@app/domains';

export class AppConfigUpdateRequestDto extends PartialType(OmitType(AppConfigCreateRequestDto, ['ident'])) implements AppConfigUpdatePayload<{}> {
}
