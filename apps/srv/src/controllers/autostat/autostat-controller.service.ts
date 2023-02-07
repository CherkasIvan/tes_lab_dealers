import { Injectable, NotFoundException } from '@nestjs/common';
import { AutostatService } from '../../modules/autostat/autostat.service';
import { DealersAutostatReportGetEndpoint, DealersAutostatReportPostEndpoint } from '@mobility/apps-dto/dist/services/dealers/autostat';
import { toAutostatReportResponse } from './response-mappers/autostat-report.mapper';

@Injectable()
export class AutostatControllerService {
    constructor(private readonly autostatService: AutostatService) {}

    async getAutostatReport(vin: string): Promise<DealersAutostatReportGetEndpoint.ResponseData> {
        const report = await this.autostatService.getDataByVin(vin);
        if (!report) {
            throw new NotFoundException();
        }
        return toAutostatReportResponse(report);
    }

    async requestMultipleReports(vins: string[]): Promise<DealersAutostatReportPostEndpoint.ResponseData> {
        await this.autostatService.requestMultipleReports(vins);
        return null;
    }
}
