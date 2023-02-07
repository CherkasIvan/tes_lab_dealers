import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { AutostatReport } from '../interfaces/autostat-report';
import { AutostatReportModel } from '../models/autostat-report.model';

@Injectable()
export class AutostatRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.reportCollection = db.collection<AutostatReport>('autostat-report');
    }

    private reportCollection;

    getCachedReport(vin: string): Promise<AutostatReport | null> {
        return this.reportCollection.findOne({ vin }).then((result) => (result ? new AutostatReportModel(result) : null));
    }

    async saveReport(report: AutostatReport): Promise<void> {
        const count = await this.reportCollection.count({ vin: report.vin });
        if (count) {
            await this.reportCollection.updateOne({ vin: report.vin, updatedAt: new Date() }, report);
            return;
        }
        await this.reportCollection.insertOne(report);
    }
}
