import { DealersCarSaleActiveApplicationsPostEndpoint } from '@mobility/apps-dto';
import { CarSaleApplicationStatuses } from '@mobility/apps-dto/dist/services/dealers/car-sale/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApplicationProposalInterface } from '../interfaces/application-proposal.interface';

export class ApplicationProposalRequestDto implements ApplicationProposalInterface, DealersCarSaleActiveApplicationsPostEndpoint.RequestBody {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    sapCode!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty()
    proposalAmount!: number;

    @ApiProperty()
    comment!: string;

    @ApiProperty()
    timestamp!: string;

    @ApiProperty()
    @IsNotEmpty()
    status!: CarSaleApplicationStatuses;
}
