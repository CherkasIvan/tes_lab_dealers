import { Injectable } from '@nestjs/common';
import { VehicleRepository } from './repositories/vehicle.repository';
import { AutostatService } from '../autostat/autostat.service';
import { AutostatReport } from '../autostat/interfaces/autostat-report';
import { InternalLogger } from '@app/common';
import { DealersService } from './dealers.service';
import { LastPacketUpdateInterface } from './interfaces/last-packet-update.interface';
import { WaService } from '../workshop-automation/wa.service';
import { WaReportModel } from '../workshop-automation/model';
import { OcnReportModel } from '../ocn-catalog/model';
import { bufferCount, concatMap, from, map, timer } from 'rxjs';
import { OcnCatalogService } from '../ocn-catalog/ocn-catalog.service';
import { BluelinkService } from '../bluelink/bluelink.service';
import { BluelinkDeviceModel } from '../bluelink/models/bluelink-device.model';
import { BluelinkLastPacketModel } from '../bluelink/models/bluelink-last-packet.model';

@Injectable()
export class DealersListenerService {
    constructor(
        private readonly repository: VehicleRepository,
        private readonly autostatService: AutostatService,
        private readonly dealersService: DealersService,
        private readonly waService: WaService,
        private readonly ocnService: OcnCatalogService,
        private readonly bluelinkService: BluelinkService,
    ) {
        this.autostatServiceSubscription = autostatService.newReportSubject$.subscribe((report) => this.handleNewAutostatReport(report));
        this.lastPacketUpdateSubscription = dealersService.lastPacketUpdateSubject$.subscribe((lastPacket) =>
            this.handleLastPacketUpdate(lastPacket),
        );
        this.waSubscription = waService.newWaReportSubject$.subscribe((report) => this.handleWADataUpdate(report));
        this.ocnSubscription = ocnService.ocnUpdateSubject$.subscribe(this.handleOCNDataUpdate.bind(this));
        this.bluelinkDeviceSubscription = bluelinkService.bluelinkDeviceUpdatedSubject$
            .pipe(
                concatMap((observable) => observable.pipe(bufferCount(1000))),
                concatMap(async (items) => {
                    const vehicles = await this.repository.findMany({ vin: { $in: items.map((item) => item.vin) } }, 0, 1000);
                    const set = new Set<string>(vehicles.map((vehicle) => vehicle.vin));
                    const filtered = items.filter((item) => set.has(item.vin));
                    this.logger.verbose(`bluelinkDeviceUpdatedSubject$, skipped nonexistent vehicles ${items.length - filtered.length}`);
                    return from(filtered);
                }),
                concatMap((observable) => observable.pipe(bufferCount(100))),
                concatMap((items) => timer(1000).pipe(map(() => items))),
            )
            .subscribe(this.handleBluelinkDeviceUpdate.bind(this));
        this.bluelinkLastPacketSubscription = bluelinkService.bluelinkLastPacketUpdatedSubject$.subscribe(
            this.handleBluelinkLastPacketUpdate.bind(this),
        );
    }
    private readonly autostatServiceSubscription;
    private readonly lastPacketUpdateSubscription;
    private readonly waSubscription;
    private readonly ocnSubscription;
    private readonly bluelinkDeviceSubscription;
    private readonly bluelinkLastPacketSubscription;
    private readonly logger = new InternalLogger(DealersListenerService.name);

    private async handleNewAutostatReport(report: AutostatReport): Promise<void> {
        this.logger.verbose(`new autostat report for vin ${report.vin}`);
        await this.repository.updateVehicle({ vin: report.vin }, { autostatReportRef: report });
    }

    private async handleLastPacketUpdate(lastPacket: LastPacketUpdateInterface): Promise<void> {
        this.logger.verbose(`new last packet for vehicle ${lastPacket.vin}`);
        const lastPacketModel = await this.repository.getLastPacket(lastPacket.vin);
        if (!lastPacketModel) {
            this.logger.error(`cannot update lastPacketRef for vehicle ${lastPacket.vin}, got null value`);
            return;
        }
        await this.repository.updateVehicle({ vin: lastPacket.vin }, { lastPacketRef: lastPacketModel });
    }

    private async handleWADataUpdate(report: WaReportModel): Promise<void> {
        this.logger.verbose(`workshop automation update for vin ${report.vin}`);
        await this.repository.updateVehicle({ vin: report.vin }, { waInfoRef: report, ocn: report.waInfo?.vehicle.ocn || null });
    }

    private async handleOCNDataUpdate(report: OcnReportModel): Promise<void> {
        this.logger.verbose(`OCN update for ocn ${report.ocn}`);
        const count = await this.repository.count({ ocn: report.ocn });
        const vehicles = await this.repository.findMany({ ocn: report.ocn }, 0, count);
        from(vehicles)
            .pipe(concatMap((vehicle) => from(this.repository.updateVehicle({ vin: vehicle.vin }, { ocnInfoRef: report }))))
            .subscribe();
    }

    private async handleBluelinkDeviceUpdate(device: BluelinkDeviceModel): Promise<void>;
    private async handleBluelinkDeviceUpdate(devices: BluelinkDeviceModel[]): Promise<void>;
    private async handleBluelinkDeviceUpdate(device: BluelinkDeviceModel[] | BluelinkDeviceModel): Promise<void> {
        if (Array.isArray(device)) {
            this.logger.verbose(`bluelink device update for vin ${device.map((item) => item.vin).join(',')}`);
            await this.repository.updateMany(device.map((item) => ({ criteria: { vin: item.vin }, vehicle: { bluelinkDeviceRef: item } })));
            return;
        }
        this.logger.verbose(`bluelink device update for vin ${device.vin}`);
        await this.repository.updateVehicle({ vin: device.vin }, { bluelinkDeviceRef: device });
    }

    private async handleBluelinkLastPacketUpdate(lastPacket: BluelinkLastPacketModel): Promise<void> {
        this.logger.verbose(`bluelink lastPacket update for vin ${lastPacket.vin}`);
        await this.repository.updateVehicle({ vin: lastPacket.vin }, { bluelinkLastPacketRef: lastPacket });
    }
}
