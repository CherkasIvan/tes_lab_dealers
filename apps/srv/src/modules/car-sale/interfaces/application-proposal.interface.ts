import { CarSaleApplicationStatuses } from '@mobility/apps-dto/dist/services/dealers/car-sale/dtos';

export interface ApplicationProposalInterface {
    sapCode: string;
    name: string;
    proposalAmount: number;
    comment: string;
    timestamp: string;
    status: CarSaleApplicationStatuses
}
