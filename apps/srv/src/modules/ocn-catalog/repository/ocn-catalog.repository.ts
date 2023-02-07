import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { OcnReportModel } from '../model';

@Injectable()
export class OcnCatalogRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.reportCollection = db.collection<OcnReportModel>('vehicles.ocn-info');
    }

    private readonly reportCollection;

    findOne(filter: Partial<OcnReportModel>): Promise<OcnReportModel | null> {
        return this.reportCollection.findOne(filter);
    }

    async saveReport(report: OcnReportModel): Promise<void> {
        const reportExist = await this.reportCollection.count({ ocn: report.ocn }).then((count) => count > 0);
        if (reportExist) {
            await this.reportCollection.updateOne({ ocn: report.ocn }, report);
        } else {
            await this.reportCollection.insertOne(report);
        }
    }
}
