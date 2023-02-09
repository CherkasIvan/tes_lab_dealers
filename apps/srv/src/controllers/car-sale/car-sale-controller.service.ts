import { Injectable } from '@nestjs/common';
import { CarSaleService } from '../../modules/car-sale/car-sale.service';
import { ApplicationProposalInterface } from '../../modules/car-sale/interfaces/application-proposal.interface';
import { DealersService } from '../../modules/dealers/dealers.service';
import { CarSaleApplicationDto } from './dtos/car-sale-application.dto';
import { CarSaleApplicationMapper } from './mappers/car-sale-application.mapper';

@Injectable()
export class CarSaleControllerService {
    constructor(private readonly carSaleService: CarSaleService, private readonly dealerService: DealersService) { }
    async getActiveApplications(activeHours = 0, page: number, onPage: number, sortDirection: 'asc' | 'desc', sortField: string): Promise<CarSaleApplicationDto[]> {
        console.log(page, onPage);
        const result = await this.carSaleService.getAllActiveApplications(activeHours, page, onPage, sortDirection, sortField);
        const vehicles = result.map((item) => new CarSaleApplicationMapper(item).getResponseModel());
        const applications = await Promise.all(vehicles.map(async item => {
            const vehicle = await this.dealerService.getVehicle(item.vin);
            const address = vehicle?.address ? vehicle.address : '';
            item.address = address;
            return item;
        }));
        return applications;
    }

    async deleteApplicationProposal(applicationId: string, sapCode: string) {
        return this.carSaleService.deleteApplicationProposal(applicationId, sapCode);
    }

    async addApplicationResponse(applicationId: string, proposal: ApplicationProposalInterface): Promise<ApplicationProposalInterface[]> {
        return this.carSaleService.addApplicationResponse(applicationId, proposal);
    }
}
