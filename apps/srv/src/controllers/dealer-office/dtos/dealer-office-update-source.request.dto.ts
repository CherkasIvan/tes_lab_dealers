import { DealersDealerOfficeVehiclesUpdateSourcePostEndpoint } from '@mobility/apps-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { DataSourceEnum } from '../../../modules/dealers/enums';

export class DealerOfficeUpdateSourceRequestDto implements DealersDealerOfficeVehiclesUpdateSourcePostEndpoint.RequestBody {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(DataSourceEnum))
    source!: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vin!: string;
}
