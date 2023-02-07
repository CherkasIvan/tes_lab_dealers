import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { WaReportModel } from '../model';

@Injectable()
export class WaReportRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.reportCollection = db.collection<WaReportModel>('vehicles.wa-info');
    }

    private readonly reportCollection;

    findOne(filter: Partial<WaReportModel>): Promise<WaReportModel | null> {
        return this.reportCollection.findOne(filter);
    }

    async saveReport(report: WaReportModel): Promise<void> {
        const reportExist = await this.reportCollection.count({ vin: report.vin }).then((count) => count > 0);
        if (reportExist) {
            await this.reportCollection.updateOne({ vin: report.vin }, report);
        } else {
            await this.reportCollection.insertOne(report);
        }
    }
}
