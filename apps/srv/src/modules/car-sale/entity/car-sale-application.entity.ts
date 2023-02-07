import { ObjectId } from 'mongodb';
import { CarSaleVehicleInfoInterface } from '../interfaces/car-sale-vehicle-info.interface';
import { LastPacketInterface } from '../../dealers/interfaces/last-packet.interface';
import { WAVehicleInfoResponseDto } from '../../../channels/workshop-automation/dto';
import { OcnDataInterface } from '../../ocn-catalog/interfaces/ocn-data.interface';
import { CarSaleCustomerInterface } from '../interfaces/car-sale-customer.interface';
import { ApplicationProposalInterface } from '../interfaces/application-proposal.interface';

export interface CarSaleApplicationEntity {
    _id?: string | ObjectId;
    applicationId: string;
    vin: string;
    customerId: string;
    customerPhone: string;
    publicationDate: Date;
    isActive: boolean;
    sequenceNumber: number;
    vehicle: CarSaleVehicleInfoInterface | null;
    vehicleLastPacket: LastPacketInterface | null;
    waInfo: WAVehicleInfoResponseDto | null;
    ocnInfo: OcnDataInterface | null;
    customer: CarSaleCustomerInterface | null;
    applicationProposals: ApplicationProposalInterface[] | null;
}
