import { DealersDealerOfficeVehiclesVehicleGetEndpoint } from '@mobility/apps-dto/dist/services/dealers';
import { Vehicle } from '../../../modules/dealers/interfaces/vehicle';
import { FullVehicleModelMapper } from './full-vehicle-model.mapper';

export function mapToVehicleCard(vehicle: Vehicle): DealersDealerOfficeVehiclesVehicleGetEndpoint.ResponseData {
    return {
        vehicle: new FullVehicleModelMapper(vehicle).getResponseModel(),
    };
}
