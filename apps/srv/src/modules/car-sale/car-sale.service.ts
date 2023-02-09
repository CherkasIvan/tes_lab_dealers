import { Injectable } from '@nestjs/common';
import { MasterUserPublisher } from '../../channels/master-user/master-user.publisher';
import { WaService } from '../workshop-automation/wa.service';
import { OcnCatalogService } from '../ocn-catalog/ocn-catalog.service';
import { CarSaleRepository } from './repository/car-sale.repository';
import { CarSaleApplicationEntity } from './entity/car-sale-application.entity';
import { InternalLogger } from '@app/common';
import { CarSaleVehicleModel } from './models/car-sale-vehicle.model';
import { VehicleService } from '../vehicle/vehicle.service';
import { NotificationService } from '../notification/notification.service';
import { ApplicationProposalInterface } from './interfaces/application-proposal.interface';
import { GetProposalFiltersDto } from './dto/get-proposal-filters.dto';
import { Filter } from 'mongodb';
import { ApplicationProposalDto } from './dto/application-proposal.dto';
import { orderBy } from 'lodash';
@Injectable()
export class CarSaleService {
    constructor(
        private readonly vehicleService: VehicleService,
        private readonly masterUser: MasterUserPublisher,
        private readonly waService: WaService,
        private readonly ocnService: OcnCatalogService,
        private readonly repository: CarSaleRepository,
        private readonly notificationService: NotificationService,
    ) { }

    private readonly logger = new InternalLogger(CarSaleService.name);

    async handleNewCarSaleEvent(id: string, vin: string, customerId: string, publicationDate: Date, customerPhone: string) {
        this.logger.verbose(`new car sale event, vin ${vin}`);
        const [vehicleResult, waInfoResult, lastPacketResult, customerProfileResult] = await Promise.allSettled([
            this.vehicleService.getVehicle(vin),
            this.waService.getReport(vin),
            this.vehicleService.getLastPacket(vin),
            this.masterUser.getCustomer(customerId),
        ]);
        const vehicle = vehicleResult.status === 'fulfilled' ? vehicleResult.value : null;
        const waInfo = waInfoResult.status === 'fulfilled' ? waInfoResult.value : null;
        const vehicleLastPacket = lastPacketResult.status === 'fulfilled' ? lastPacketResult.value : null;
        const customer = customerProfileResult.status === 'fulfilled' ? customerProfileResult.value : null;
        const ocn = vehicle?.vehicle.ocn || waInfo?.vehicle.ocn;
        const ocnInfo = ocn ? await this.ocnService.getCatalogData(ocn) : null;
        const total = await this.repository.count({});
        const saved = await this.repository.findOne({ applicationId: id });
        const entity: CarSaleApplicationEntity = {
            vin,
            vehicle,
            ocnInfo,
            vehicleLastPacket,
            customerId,
            waInfo,
            applicationId: id,
            customer,
            publicationDate,
            isActive: true,
            customerPhone,
            sequenceNumber: saved === null ? total + 1 : saved.sequenceNumber,
            applicationProposals: null,
        };
        await this.repository.saveCarSaleApplication(entity);
        const model = await this.repository.findOne({ applicationId: id });
        if (!model) {
            this.logger.warn(`Cannot send car sale message for application id ${id}, db returned null`);
            return;
        }
        await this.notificationService.sendCarSaleMessage(model);
    }

    async getAllActiveApplications(activeHours = 48, page: number, onPage: number, sortDirection: 'asc' | 'desc', sortField: string): Promise<CarSaleVehicleModel[]> {
        const activeUntil = activeHours > 0 ? new Date(new Date().getTime() - 1000 * 60 * 60 * activeHours) : new Date(0);
        const filter = { isActive: true, publicationDate: { $gt: activeUntil } };
        const application = await this.repository.findMany(filter, page, onPage);
        return orderBy(application, sortField, sortDirection);
    }

    async addApplicationResponse(applicationId: string, proposal: ApplicationProposalInterface): Promise<ApplicationProposalInterface[]> {
        const application = await this.repository.findOne({ applicationId });
        if (!application) {
            this.logger.warn('application not found');
            return [];
        }
        if (!application.applicationProposals) {
            await this.repository.updateApplicationProposals(applicationId, [proposal]);
            return [proposal];
        }
        const newApplicationProposals = [
            ...application.applicationProposals.filter((val) => val.sapCode !== proposal.sapCode),
            proposal,
        ];
        await this.repository.updateApplicationProposals(applicationId, newApplicationProposals);
        return newApplicationProposals;
    }

    async deleteApplicationProposal(applicationId: string, sapCode: string) {
        const application = await this.repository.findOne({ applicationId });
        if (!application || !application.applicationProposals) {
            this.logger.warn('application or proposals not found');
            return;
        }
        await this.repository.updateApplicationProposals(applicationId, [
            ...application.applicationProposals.filter((val) => val.sapCode !== sapCode),
        ]);
    }

    async getApplicationProposals(filters: GetProposalFiltersDto): Promise<ApplicationProposalInterface[]> {
        let dbFilter: Filter<CarSaleApplicationEntity> = { isActive: true };
        if (filters.id) {
            dbFilter = { ...dbFilter, applicationId: filters.id };
        }
        if (filters.customerId) {
            dbFilter = { ...dbFilter, customerId: filters.customerId };
        }
        const applications = await this.repository.findMany(dbFilter);
        const proposals = applications
            .filter((application) => !!application.applicationProposals)
            .map((application) => {
                return application.applicationProposals?.map((proposal): ApplicationProposalDto => {
                    return {
                        ...proposal,
                        applicationId: application.applicationId,
                    };
                });
            })
            .flat(1)
            .filter((val) => !!val) as ApplicationProposalInterface[];
        return proposals;
    }
}
