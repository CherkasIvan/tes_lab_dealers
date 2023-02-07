import { Injectable } from '@nestjs/common';
import { WaPublisher } from '../../channels/workshop-automation/wa.publisher';
import { WAVehicleInfoResponseDto } from '../../channels/workshop-automation/dto';
import { WaReportRepository } from './repository/wa-report.repository';
import { catchError, concatAll, concatMap, defer, forkJoin, mergeMap, of, retry, Subject, tap, timer } from 'rxjs';
import { InternalLogger } from '@app/common';
import { WaReportModel } from './model';

@Injectable()
export class WaService {
    constructor(private readonly publisher: WaPublisher, private readonly repository: WaReportRepository) {}

    public readonly newWaReportSubject$ = new Subject<WaReportModel>();
    public readonly logger = new InternalLogger(WaService.name);

    async getReport(vin: string, force = false): Promise<WAVehicleInfoResponseDto | null> {
        const report = await this.repository.findOne({ vin });
        if (report && !force) {
            return report.waInfo;
        }

        const waInfo = await this.publisher.getVinReport(vin);
        const reportModel: WaReportModel = {
            vin,
            waInfo,
            updatedAt: new Date(),
        };
        await this.repository.saveReport(reportModel);
        this.newWaReportSubject$.next(reportModel);
        return waInfo;
    }

    requestReports(vins: string[]) {
        this.logger.verbose(`wa reports request, total count: ${vins.length}`);
        const repeatTime = 1000;
        const repeatCount = 5;
        let counter = 0;
        of(vins)
            .pipe(
                concatAll(),
                concatMap((vin) =>
                    forkJoin([
                        timer(100),
                        defer(() => this.getReport(vin)).pipe(
                            retry({ count: repeatCount, delay: repeatTime }),
                            catchError((error: Error) => {
                                this.logger.warn(`wa reports request: cannot get report for vin ${vin}, error: ${error.message}`);
                                return of(false);
                            }),
                        ),
                    ]),
                ),
                mergeMap((result) => of(result[1])),
                tap((result) => {
                    this.logger.verbose(
                        `wa reports request: processed vin ${vins[counter]}, ${counter + 1}/${vins.length}, success: ${result !== false}`,
                    );
                    counter++;
                }),
            )
            .subscribe();
    }
}
