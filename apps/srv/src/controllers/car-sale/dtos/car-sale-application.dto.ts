import { VehicleFullModelInterface } from '@mobility/apps-dto';
import { ApplicationProposalInterface } from '../../../modules/car-sale/interfaces/application-proposal.interface';

export interface CarSaleApplicationDto extends VehicleFullModelInterface {
    customerId: string;
    customerPhoneNumber: string;
    customerFistName: string | null;
    customerLastName: string | null;
    vehicleBrand: string;
    publicationDate: Date;
    sequenceNumber: number;
    id: string;
    vin: string;
    vehicleModel: string;
    applicationProposals: ApplicationProposalInterface[] | null;
}
