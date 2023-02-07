import { Injectable } from '@nestjs/common';
import { BluelinkConfigService } from './bluelink-config.service';
import { BluelinkRepository } from './repository/bluelink.repository';
import { BluelinkQueryService } from './bluelink-query.service';
import { concatMap, forkJoin, from, lastValueFrom, Observable, Subject, tap, timer } from 'rxjs';
import { BluelinkLastPacketModel } from './models/bluelink-last-packet.model';
import { BluelinkConfigDto } from './dto/bluelink-config.dto';
import { BluelinkLastPacketInterface } from './interfaces';
import { BluelinkDeviceModel } from './models/bluelink-device.model';
import { InternalLogger } from '@app/common';
import { S3Service } from '../s3/s3.service';
import { BluelinkDumpReaderService } from './bluelink-dump-reader.service';

@Injectable()
export class BluelinkService {
    constructor(
        private readonly configService: BluelinkConfigService,
        private readonly repository: BluelinkRepository,
        private readonly queryService: BluelinkQueryService,
        private readonly s3Service: S3Service,
        private readonly dumpReader: BluelinkDumpReaderService,
    ) {}

    public readonly bluelinkDeviceUpdatedSubject$ = new Subject<Observable<BluelinkDeviceModel>>();
    public readonly bluelinkLastPacketUpdatedSubject$ = new Subject<BluelinkLastPacketModel>();
    private readonly logger = new InternalLogger(BluelinkService.name);

    private isCacheExpired(config: BluelinkConfigDto, lastupdate?: Date) {
        if (!config.cacheExpirationSeconds || !lastupdate) {
            return false;
        }

        const cacheDateSeconds = lastupdate.getTime() / 1000;
        const cacheExpirationDate = new Date((cacheDateSeconds + config.cacheExpirationSeconds) * 1000);
        const now = new Date();

        return now >= cacheExpirationDate;
    }

    /**
     */
    async getDeviceInfo(vin: string): Promise<BluelinkDeviceModel | null> {
        return this.repository.getBluelinkDeviceInfo(vin);
    }

    async getLastPacketInfo(vin: string, force = false): Promise<BluelinkLastPacketModel> {
        const config = await this.configService.get();
        const cached = await this.repository.getBluelinkLastPacket(vin);

        const isCacheExpired = this.isCacheExpired(config, cached?.updatedAt);

        if (cached && !isCacheExpired && !force) {
            return cached;
        }

        const result = new BluelinkLastPacketModel({
            ...cached,
            updatedAt: new Date(),
            vin,
        });

        const lastPacket = await this.queryLastPacket(vin);

        result.gpsInfo = lastPacket.gpsInfo;
        result.basicInfo = lastPacket.basicInfo;
        result.vehicleStatus = lastPacket.vehicleStatus;

        await this.repository.saveLastPacket(result);
        this.bluelinkLastPacketUpdatedSubject$.next(result);

        return result;
    }

    async queryLastPacket(vin: string): Promise<BluelinkLastPacketInterface> {
        const gpsInfo = this.queryService.getGpsInfo(vin);
        const vehicleStatus = this.queryService.getVehicleStatus(vin);
        const basicInfo = this.queryService.getBasicInfo(vin);
        return Promise.all([gpsInfo, vehicleStatus, basicInfo]).then(([gpsInfoResponse, vehicleStatusResponse, basicInfoResponse]) => ({
            vin,
            gpsInfo: gpsInfoResponse,
            basicInfo: basicInfoResponse,
            vehicleStatus: vehicleStatusResponse,
        }));
    }

    async loadDevicesFromS3(force = false): Promise<void> {
        const bucket = 'bluelink';
        const files = await this.s3Service.listFilesInBucket(bucket);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.logger.verbose(`processing file ${i + 1}/${files.length}, ${file.name}`);
            const fileUrl = await this.s3Service.getFileUrl(bucket, file.name);
            if (!fileUrl) {
                this.logger.warn(`cannot load file ${file.name}, url is null`);
                continue;
            }
            const entries = await this.dumpReader.parseFromUrl(fileUrl);
            this.logger.verbose(`file ${file.name} total entries: ${entries.length}`);
            const prepared = entries.map((item) => BluelinkDeviceModel.fromCsvEntry(item));
            const inserted = await this.repository.insertDevices(prepared, force);
            this.logger.verbose(`file ${file.name} inserted entries: ${inserted.length}`);
            this.bluelinkDeviceUpdatedSubject$.next(from(inserted));
        }
    }

    async updateLastPackets(vins: string[]): Promise<void> {
        let counter = 0;
        await lastValueFrom(
            from(vins).pipe(
                concatMap((vin) => forkJoin([timer(200), from(this.getLastPacketInfo(vin, true))])),
                tap(() => {
                    this.logger.verbose(`bluelink last packet updated for vin ${vins[counter]}, progress ${counter + 1}/${vins.length}`);
                    counter++;
                }),
            ),
        );
    }
}
