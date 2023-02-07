import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDefined,
    IsString,
} from 'class-validator';
import { DealersDealerOfficeGeozoneUpdateEndpoint } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dealers-dealer-office-geozone-update.endpoint';

export class DealerOfficeCarReportsRequestQeryParamsDto implements DealersDealerOfficeGeozoneUpdateEndpoint.RequestQueryParams {
    [key: string]: string | number | string[] | undefined;
    @ApiPropertyOptional()
    @IsDefined()
    @IsString()
    dealerOffice!: string;
}
