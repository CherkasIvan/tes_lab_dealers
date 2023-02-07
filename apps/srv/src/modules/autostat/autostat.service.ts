import { Injectable } from '@nestjs/common';
import { AutostatQuery } from './abstract/autostat-query';
import { AutostatMapperService } from './autostat-mapper.service';
import { AutostatConfigService } from './autostat-config.service';
import { concatAll, concatMap, forkJoin, from, of, Subject, tap, timer } from 'rxjs';
import { AutostatRepository } from './repository/autostat.repository';
import { AutostatReportModel } from './models/autostat-report.model';
import { AutostatReport } from './interfaces/autostat-report';
import { InternalLogger } from '@app/common';

@Injectable()
export class AutostatService {
    constructor(
        private readonly autostatConfigService: AutostatConfigService,
        private readonly autostatRepository: AutostatRepository,
        private readonly autostatQuery: AutostatQuery,
        private readonly autostatMapper: AutostatMapperService,
    ) {}

    public readonly newReportSubject$ = new Subject<AutostatReport>();

    private readonly logger = new InternalLogger(AutostatService.name);

    async getDataByVin(vin: string, forced?: boolean): Promise<AutostatReport> {
        const config = await this.autostatConfigService.get();

        const cached = await this.autostatRepository.getCachedReport(vin);

        const isCacheExpired = this.autostatConfigService.isCacheExpired(config, cached?.updatedAt);

        if (cached && !isCacheExpired && !forced) {
            // const raw = cached.raw as {
            //     mainData: Autostat.ParsedResponse;
            //     priceData: Autostat.ParsedResponse;
            // };
            return cached;
        }

        const mainData = await this.autostatQuery.decodeVin({ vin }, config);
        const priceData = await this.autostatQuery.getPrice({ vin, gearboxkey: 0, mileage: 0, statekey: 0 }, config);

        const vehicle = this.autostatMapper.getDomain(mainData, priceData);

        const report = new AutostatReportModel({
            vin,
            ...vehicle,
            raw: {
                mainData,
                priceData,
            },
        });

        await this.autostatRepository.saveReport(report);
        this.newReportSubject$.next(report);

        return report;
    }

    requestMultipleReports(vins: string[]): void {
        let counter = 0;
        of(vins)
            .pipe(
                concatAll(),
                concatMap((vin) => forkJoin([timer(200), from(this.getDataByVin(vin))])),
                tap(() => {
                    this.logger.verbose(`processed vin ${vins[counter]}, ${counter + 1}/${vins.length}`);
                    counter++;
                }),
            )
            .subscribe();
    }
}
