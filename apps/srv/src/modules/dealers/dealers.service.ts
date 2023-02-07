/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import { DealersRepository } from './repositories/dealers.repository';
import { parse } from 'csv-parse/sync';
import { CsvDumpEntryInterface } from './interfaces/csv-dump-entry.interface';
import { CsvDumpParserUtil } from './utils/csv-dump-parser.util';
import { bufferCount, concatMap, filter, forkJoin, from, lastValueFrom, map, mergeMap, Observable, Subject, tap, timer, toArray } from 'rxjs';
import { InternalLogger } from '@app/common';
import { VehicleRepository } from './repositories/vehicle.repository';
import { Dealer } from './interfaces/dealer.interface';
import { DealerOffice } from './interfaces/dealer-office.interface';
import { Vehicle } from './interfaces/vehicle';
import { DadataService } from '../dadata/dadata.service';
import { LastPacketUpdateInterface } from './interfaces/last-packet-update.interface';
import { VehicleDeviceIdInterface } from './interfaces/vehicle-device-id.interface';
import { GeozonePublisher } from '../../channels/geozone/geozone.publisher';
import {
    CarReportV2,
    DealersDealerOfficeCarReportsV2PostEndpoint,
    DealersDealerOfficeGeozonesGetV2Endpoint,
} from '@mobility/apps-dto/dist/services/dealers';
import { DealersDealerOfficeGeozoneUpdateEndpoint } from '@mobility/apps-dto/dist/services/dealers/dealer-office/dealers-dealer-office-geozone-update.endpoint';
import { DealerOfficeCarReportsV2RequestDto } from '../../controllers/dealer-office/dtos/dealer-office-car-reports-v2.request.dto';
import { DealerOfficeGeozone } from './interfaces/dealer-office-geozone.interface';
import { CollectGeozoneEventsHistoryRequestDto } from '../../controllers/dev/dtos/collect-geozone-events-history.request.dto';
import { environment } from '../../environment';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleModel } from './models';
import { VehicleLastPacketModel } from './models/vehicle-last-packet.model';

@Injectable()
export class DealersService {
    constructor(
        private readonly dealerRepository: DealersRepository,
        private readonly vehicleRepository: VehicleRepository,
        private readonly parserUtil: CsvDumpParserUtil,
        private readonly dadataService: DadataService,
        private readonly geozonePublisher: GeozonePublisher,
        private readonly vehicleService: VehicleService,
    ) { }

    private readonly logger = new InternalLogger(DealersService.name);
    public readonly lastPacketUpdateSubject$ = new Subject<LastPacketUpdateInterface>();

    async loadFromCsv(csvcontent: Buffer | string): Promise<unknown> {
        const content = parse(csvcontent, { columns: true }) as CsvDumpEntryInterface[];
        const parsed = this.parserUtil.parseCsvEntries(content);
        await this.dealerRepository.saveDealers(parsed.dealers);
        await this.dealerRepository.saveDealerOffices(parsed.dealerOffices);
        await this.vehicleRepository.insertVehicles(parsed.vehicles);
        await this.dealerRepository.saveRelations(parsed.relations);
        await this.attachNewVehiclesToExistingGeozones(parsed.vehicles.map((val) => val.getDeviceId()).filter((val) => /^\d+$/.test(val)));
        await this.dealerRepository.recalculateSales();
        this.vehicleRepository.reaggregate(parsed.relations.map((relation) => relation.vin));
        return 'ok';
    }

    async getDealersList(): Promise<Dealer[]> {
        return this.dealerRepository.getDealers();
    }

    async getSubDealers(dealerSapCode: string): Promise<DealerOffice[]> {
        return this.dealerRepository.getDealerOffices([dealerSapCode], []);
    }

    async testConnection(): Promise<boolean> {
        return this.dealerRepository
            .test()
            .then(() => true)
            .catch(() => false);
    }

    getVehicleLastPacket(vin: string): Promise<VehicleLastPacketModel | null> {
        return this.vehicleRepository.getLastPacket(vin);
    }

    async updateVehicle(vin: string): Promise<void> {
        const vehicle = await this.vehicleService.getVehicle(vin);
        const lastPacket = await this.getVehicleLastPacket(vin);
        if (!vehicle) {
            this.logger.warn(`cannot update vehicle ${vin}, response is null or undefined`);
            return;
        }
        const deviceActiveStatus = vehicle?.vehicle.blocks[0]?.active
            ? 'Активирован'
            : lastPacket?.lastPacket?.packetTime
                ? 'Деактивирован'
                : 'Не активирован';

        const updatedVehicle = {
            deviceType: vehicle?.vehicle.blocks[0]?.model,
            deviceActiveStatus,
            simId: vehicle?.vehicle.blocks[0]?.id,
        };
        this.vehicleRepository.updateVehicle({ vin: vehicle?.vehicle.vin }, updatedVehicle);
    }

    async updateVehicles(vins?: string[]): Promise<void> {
        this.logger.verbose('start updateVehicles');
        const criteria = vins?.length ? { vin: { $in: vins } } : {};
        const totalCount = await this.vehicleRepository.count(criteria);
        this.logger.verbose(`total count: ${totalCount}`);
        let counter = 0;
        const step = 10;
        const totalPages = totalCount / step;
        for (let page = 0; page < totalPages; page++) {
            await lastValueFrom(this.vehicleRepository.getAllForUpdateVehicles(criteria, page, step).pipe(
                mergeMap(vehicles => vehicles),
                concatMap((vehicle) => forkJoin([from(this.updateVehicle(vehicle.vin)), timer(200)])),
                tap(() => {
                    this.logger.verbose(`vehicle ${counter + 1}/${totalCount} done`);
                    counter++;
                }),
            ));
        }
        this.logger.verbose('Vehicles sync done');
    }

    async updateLastPacket(vehicleOrVin: string | Vehicle): Promise<void> {
        const vin = typeof vehicleOrVin === 'string' ? vehicleOrVin : vehicleOrVin.vin;
        const vehicle = typeof vehicleOrVin === 'object' ? vehicleOrVin : await this.vehicleRepository.findOne({ vin });
        if (!vehicle) {
            this.logger.warn(`cannot update last packet for vehicle ${vin}`);
            return;
        }
        const lastPacket = await this.vehicleService.getLastPacket(vehicle.vin);
        if (!lastPacket) {
            this.logger.warn(`cannot update last packet for vehicle ${vin}, last packet is null`);
            return;
        }
        const vehicleForUpdate: Partial<VehicleModel> = {
            ...vehicle,
        };
        await this.vehicleRepository.updateVehicle({ vin }, vehicleForUpdate);
        await this.vehicleRepository.saveLastPacket(vehicle, lastPacket);
        this.lastPacketUpdateSubject$.next({ vin: vehicle.vin, lastPacket });
    }

    async updateLastPackets(vins?: string[]): Promise<void> {
        this.logger.verbose('start updateLastPackets');
        const criteria = vins?.length ? { vin: { $in: vins } } : { deviceActiveStatus: 'Активирован' };
        const totalCount = await this.vehicleRepository.count(criteria);
        this.logger.verbose(`total count: ${totalCount}`);
        let counter = 0;
        const step = 10;
        const totalPages = totalCount / step;
        for (let page = 0; page < totalPages; page++) {
            await lastValueFrom(this.vehicleRepository.getAllForUpdateVehicles(criteria, page, step).pipe(
                mergeMap(vehicles => vehicles),
                concatMap((vehicle) => forkJoin([from(this.updateLastPacket(vehicle)), timer(200)])),
                tap(() => {
                    this.logger.verbose(`vehicle ${counter + 1}/${totalCount} done`);
                    counter++;
                }),
            ));
        }
        this.logger.verbose('last packets sync done');
    }

    async updateLocations(): Promise<void> {
        this.vehicleRepository
            .getAll()
            .pipe(
                filter((vehicle) => vehicle.lastPacket !== null),
                map((vehicle) => vehicle.vin),
                toArray(),
                tap((vins) => this.updateMultipleLocations(vins)),
            )
            .subscribe();
    }

    async updateVehicleLocation(vehicleOrVin: string | Vehicle): Promise<void> {
        const vin = typeof vehicleOrVin === 'string' ? vehicleOrVin : vehicleOrVin.vin;
        const vehicle = typeof vehicleOrVin === 'object' ? vehicleOrVin : await this.vehicleRepository.findOne({ vin });
        if (!vehicle) {
            this.logger.warn(`Cannot geolocate vehicle ${vehicleOrVin}, vehicle does not exist`);
            return;
        }
        if (!vehicle.lastPacket?.latitude || !vehicle.lastPacket.longitude) {
            this.logger.warn(`Cannot geolocate vehicle ${vehicleOrVin}, location unknown`);
            vehicle.addressUpdatedAt = new Date();
            await this.vehicleRepository.updateVehicle({ vin: vehicle.vin }, vehicle);
            return;
        }
        const [lat, lon] = [Number(vehicle.lastPacket.latitude), Number(vehicle.lastPacket.longitude)];
        const address = await this.dadataService.getAddress(lat, lon);
        await this.vehicleRepository.updateVehicle({ vin: vehicle.vin }, { address, addressUpdatedAt: new Date() });
    }

    updateMultipleLocations(vins: string[]): void {
        let counter = 0;
        from(vins)
            .pipe(
                concatMap((vin) => forkJoin([timer(200), from(this.updateVehicleLocation(vin))])),
                tap(() => {
                    this.logger.verbose(`update location processed vin ${vins[counter]}, ${counter + 1}/${vins.length}`);
                    counter++;
                }),
            )
            .subscribe();
    }

    getAllDealerVehicles(filter: { dealerSapCodes?: string[]; dealerOfficeIds?: string[] }): Promise<Observable<Vehicle>> {
        return this.dealerRepository.getDealerVehicles(filter.dealerSapCodes || [], filter.dealerOfficeIds || []);
    }

    getVehicle(vin: string): Promise<Vehicle | null> {
        return this.vehicleRepository.findOne({ vin });
    }

    getVehicles(vins: string[]): Promise<Vehicle[]> {
        return this.vehicleRepository.findMany({ vin: { $in: vins } }, 0, vins.length);
    }

    async forceReaggregateVins(vins: string[]): Promise<void> {
        await this.vehicleRepository.reaggregate(vins);
    }

    async loadSimIds(csvcontent: Buffer | string): Promise<void> {
        const content = parse(csvcontent, { columns: true }) as VehicleDeviceIdInterface[];
        await this.vehicleRepository.loadVehicleSimIds(content);
    }

    async getGeozones(filter: {
        dealerSapCodes?: string[];
        dealerOfficeIds?: string[];
    }): Promise<DealersDealerOfficeGeozonesGetV2Endpoint.ResponseData> {
        let dealerOffices;
        if (!filter.dealerSapCodes && !filter.dealerOfficeIds) {
            dealerOffices = await this.dealerRepository.getAllDealerOffices();
        } else {
            dealerOffices = await this.dealerRepository.getDealerOffices(filter.dealerSapCodes || [], filter.dealerOfficeIds || []);
        }
        return {
            geozones: dealerOffices.map((office) => office.geozone).filter((val) => !!val) as DealerOfficeGeozone[],
        };
    }

    // eslint-disable-next-line max-lines-per-function
    async getCarReports(query: DealerOfficeCarReportsV2RequestDto): Promise<DealersDealerOfficeCarReportsV2PostEndpoint.ResponseData> {
        const vehicleInfo = await this.getAllDealerVehicles({ dealerOfficeIds: query.dealerOffices, dealerSapCodes: query.dealers }).then(
            (vehicles$) =>
                lastValueFrom(
                    vehicles$.pipe(
                        concatMap(async (vehicle) => ({
                            vin: vehicle.vin,
                            deviceId: vehicle.getDeviceId(),
                        })),
                        filter((val) => /^\d+$/.test(val.deviceId)),
                        toArray(),
                    ),
                ),
        );
        const { geozones } = await this.getGeozones({});
        const deviceIds = vehicleInfo.map((val) => val.deviceId);
        const reports = (
            await lastValueFrom(
                from(deviceIds).pipe(
                    bufferCount(environment.geozoneEventsBatchSize),
                    concatMap(async (deviceIds) =>
                        this.geozonePublisher
                            .getCarReports(deviceIds, query.dateStart, query.dateEnd)
                            .then((res) => (res.result ? res.result.vehicles : [])),
                    ),
                    toArray(),
                ),
            )
        ).flat(1);
        reports.forEach((carReport) => {
            carReport.geoZones = carReport.geoZones.filter(
                (geozoneReport) => geozones.findIndex((val) => val.externalId === geozoneReport.id) !== -1,
            );
        });
        const processedReports: CarReportV2[] = reports
            .map((vehicleReport) => {
                const vin = vehicleInfo.find((vehicle) => vehicle.deviceId === vehicleReport.deviceId)?.vin || '';
                return vehicleReport.geoZones.map((geozoneReport) => {
                    const processedReports: CarReportV2[] = [];
                    for (let index = 0; index < geozoneReport.events.length - 1; index = index + 2) {
                        const report1 = geozoneReport.events[index];
                        const report2 = geozoneReport.events[index + 1];
                        const processedReport: CarReportV2 = {
                            vin,
                            geozoneId: geozoneReport.id,
                            timeVisit: report1.unixtime,
                            timeLeave: report2.unixtime,
                            timeSpend: report2.unixtime - report1.unixtime,
                        };
                        if (processedReport.timeSpend > (query.minTimeSpend || 1200)) {
                            processedReports.push(processedReport);
                        }
                    }
                    return processedReports;
                });
            })
            .flat(2);
        return { reports: processedReports };
    }

    async changeVehicleActivationStatus(vin: string, active: boolean, isMainBlock: boolean) {
        this.logger.verbose(`change activation status event: vin ${vin}, active: ${active}, isMainBlock: ${isMainBlock}`);
        const vehicle = await this.vehicleRepository.findOne({ vin });
        if (!vehicle) {
            this.logger.warn(`cannot change activation status for vehicle ${vin}, vehicle not found`);
            return;
        }
        if (active && isMainBlock) {
            vehicle.changeDeviceActiveStatus(active);
        }
        if (!active) {
            vehicle.changeDeviceActiveStatus(active);
        }
        await this.vehicleRepository.updateVehicle({ vin }, vehicle);
    }

    async updateDealerOfficeGeozone(
        dealerOfficeSapCode: string,
        geozone: DealerOfficeGeozone,
    ): Promise<DealersDealerOfficeGeozoneUpdateEndpoint.ResponseData> {
        const dealerOffice = await this.dealerRepository.getDealerOffice(dealerOfficeSapCode);
        if (!dealerOffice) {
            return {
                success: false,
                errors: ['Dealers office not found'],
            };
        }
        if (dealerOffice.geozone?.externalId) {
            await this.geozonePublisher.deleteGeozones([dealerOffice.geozone.externalId]);
        }
        const externalId = await this.geozonePublisher.addGeozone(geozone);
        dealerOffice.geozone = geozone;
        if (externalId) {
            await this.attachVehiclesToGeozone([externalId]);
            dealerOffice.geozone.externalId = externalId;
        }
        await this.dealerRepository.updateDealerOfficeGeozone(dealerOfficeSapCode, dealerOffice.geozone);
        return {
            success: true,
        };
    }

    async attachNewVehiclesToExistingGeozones(deviceIds: string[]) {
        const geozoneIds = (await this.dealerRepository.getAllDealerOffices())
            .filter((office) => !!office.geozone)
            .map((office) => office.geozone?.externalId)
            .filter((externalId) => !!externalId) as string[];
        if (deviceIds.length > 0) {
            await lastValueFrom(
                from(deviceIds).pipe(
                    bufferCount(1000),
                    concatMap((deviceIdArr) => this.geozonePublisher.bindGeozones(geozoneIds, deviceIdArr)),
                ),
            );
        }
    }

    async attachVehiclesToGeozone(geozoneIds: string[]) {
        const deviceIds = await lastValueFrom(
            this.vehicleRepository.getAll().pipe(
                map((vehicle) => vehicle.getDeviceId()),
                filter((val) => /^\d+$/.test(val)),
                toArray(),
            ),
        );
        if (deviceIds.length > 0) {
            await lastValueFrom(
                from(deviceIds).pipe(
                    bufferCount(1000),
                    concatMap((deviceIdArr) => this.geozonePublisher.bindGeozones(geozoneIds, deviceIdArr)),
                ),
            );
        }
    }

    async collectGeozoneEvents(body: CollectGeozoneEventsHistoryRequestDto) {
        await this.geozonePublisher.collectEvents(body);
    }
}
