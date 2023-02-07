import { Injectable } from '@nestjs/common';
import { DealerOfficeGeolocateManyRequestDto } from './dtos/dealer-office-geolocate-many.request.dto';
import { DealersService } from '../../modules/dealers/dealers.service';
import { WaService } from '../../modules/workshop-automation/wa.service';
import { OcnCatalogService } from '../../modules/ocn-catalog/ocn-catalog.service';
import { BluelinkService } from '../../modules/bluelink/bluelink.service';
import { CollectGeozoneEventsHistoryRequestDto } from './dtos/collect-geozone-events-history.request.dto';

@Injectable()
export class DevControllerService {
    constructor(
        private readonly dealerService: DealersService,
        private readonly waService: WaService,
        private readonly ocnService: OcnCatalogService,
        private readonly bluelinkService: BluelinkService,
    ) { }

    async geolocateMany(body: DealerOfficeGeolocateManyRequestDto): Promise<void> {
        await this.dealerService.updateMultipleLocations(body.vins);
    }

    reaggregate(vins: string[]) {
        this.dealerService.forceReaggregateVins(vins);
    }

    getVehicleLastPacket(vin: string) {
        return this.dealerService.getVehicleLastPacket(vin);
    }

    updateLastPackets(vins?: string[]) {
        return this.dealerService.updateLastPackets(vins);
    }

    loadDealersFromCsv(buffer: Buffer) {
        return this.dealerService.loadFromCsv(buffer);
    }

    async loadWAInfo(vins: string[]): Promise<void> {
        await this.waService.requestReports(vins);
    }

    async loadOcnInfo(vins: string[]): Promise<void> {
        await this.ocnService.requestReports(vins);
    }

    loadDeviceIdFromCsv(buffer: Buffer) {
        return this.dealerService.loadSimIds(buffer);
    }

    syncBluelinkDevices(force = false) {
        this.bluelinkService.loadDevicesFromS3(force);
    }

    loadBluelinkPackets(vins: string[]) {
        this.bluelinkService.updateLastPackets(vins);
    }

    collectEventsHistory(body: CollectGeozoneEventsHistoryRequestDto) {
        this.dealerService.collectGeozoneEvents(body);
    }

    updateVehicles(vins: string[]) {
        this.dealerService.updateVehicles(vins);
    }
}
