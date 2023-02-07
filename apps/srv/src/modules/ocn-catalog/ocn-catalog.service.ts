import { Injectable } from '@nestjs/common';
import { OcnPublisher } from '../../channels/ocn/ocn.publisher';
import { concatAll, concatMap, forkJoin, from, of, Subject, tap, timer } from 'rxjs';
import { OcnDataInterface } from './interfaces/ocn-data.interface';
import { OcnCatalogRepository } from './repository/ocn-catalog.repository';
import { OcnReportModel } from './model';
import { InternalLogger } from '@app/common';
import { DealersService } from '../dealers/dealers.service';

@Injectable()
export class OcnCatalogService {
    constructor(
        private readonly publisher: OcnPublisher,
        private readonly repository: OcnCatalogRepository,
        public readonly dealerService: DealersService,
    ) {}
    private readonly logger = new InternalLogger(OcnCatalogService.name);
    public readonly ocnUpdateSubject$ = new Subject<OcnReportModel>();

    async getCatalogData(ocn: string, force = false): Promise<OcnDataInterface | null> {
        const report = await this.repository.findOne({ ocn });
        if (report && !force) {
            return report.ocnData;
        }

        const ocnData = await this.publisher.getCatalogDataByOCN(ocn);
        const reportModel = new OcnReportModel({
            ocn,
            ocnData,
            updatedAt: new Date(),
        });
        await this.repository.saveReport(reportModel);
        this.ocnUpdateSubject$.next(reportModel);
        return ocnData;
    }

    async requestReports(vins: string[]) {
        this.logger.verbose('OCN request by vins: requisting vehicles...');
        const vehicles = await this.dealerService.getVehicles(vins);
        const ocns: string[] = vehicles
            .map((vehicle) => vehicle.waInfo?.vehicle.ocn || null)
            .filter((item): boolean => item !== null) as string[];
        const ocnArray = Array.from(new Set<string>(ocns));
        this.logger.verbose(`OCN reports request, total count: ${ocnArray.length}`);
        let counter = 0;
        of(ocnArray)
            .pipe(
                concatAll(),
                concatMap((ocn) => forkJoin([timer(100), from(this.getCatalogData(ocn))])),
                tap(() => {
                    this.logger.verbose(`OCN reports request: processed ocn ${ocnArray[counter]}, ${counter + 1}/${ocnArray.length}`);
                    counter++;
                }),
            )
            .subscribe();
    }
}
