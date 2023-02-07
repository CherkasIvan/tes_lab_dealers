import { AutostatVehicleInterface } from '../../../modules/autostat/interfaces/autostat-vehicle.interface';
import { DealersAutostatReportGetEndpoint } from '@mobility/apps-dto/dist/services/dealers/autostat';

export function toAutostatReportResponse(report: AutostatVehicleInterface): DealersAutostatReportGetEndpoint.ResponseData {
    return {
        report,
    };
}
