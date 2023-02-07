import { CarSaleVehicleModel } from '../../../modules/car-sale/models/car-sale-vehicle.model';
import { CarSaleApplicationDto } from '../dtos/car-sale-application.dto';
import { FullVehicleModelMapper } from '../../dealer-office/response-mappers/full-vehicle-model.mapper';

export class CarSaleApplicationMapper {
    constructor(private application: CarSaleVehicleModel) {}

    getResponseModel(): CarSaleApplicationDto {
        return {
            ...new FullVehicleModelMapper(this.application).getResponseModel(),
            customerId: this.application.customerId,
            customerPhoneNumber: this.application.customerPhone,
            customerFistName: this.application.customer?.firstName || null,
            customerLastName: this.application.customer?.lastName || null,
            vehicleBrand: this.application.getBrand(),
            publicationDate: this.application.publicationDate,
            sequenceNumber: this.application.sequenceNumber,
            id: this.application.applicationId,
            vehicleModel: this.application.model,
            applicationProposals: this.application.applicationProposals,
        };
    }
}
