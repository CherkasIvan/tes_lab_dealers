import { Injectable } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InternalLogger } from '@app/common';
import { BluelinkService } from '../bluelink/bluelink.service';
import { VehicleRepository } from './repositories/vehicle.repository';

@Injectable()
export class DealersCronService {
    constructor(
        private readonly dealersService: DealersService,
        private readonly bluelinkService: BluelinkService,
        private readonly repository: VehicleRepository,
    ) {}
    private readonly logger = new InternalLogger(DealersCronService.name);

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updatePacketsCron(): Promise<void> {
        this.logger.verbose('start updatePackets job');
        await this.dealersService.updateLastPackets();
        await this.updateBluelinkLastPackets();
        await this.dealersService.updateLocations();
        this.logger.verbose('end updatePackets job');
    }

    async updateBluelinkLastPackets(): Promise<void> {
        this.logger.verbose('start updateBluelinkLastPackets job');
        const criteria = { bluelinkDeviceRef: { $ne: null } };
        const count = await this.repository.count(criteria);
        const vehicles = await this.repository.findMany(criteria, 0, count);
        await this.bluelinkService.updateLastPackets(vehicles.map((vehicle) => vehicle.vin));
    }
}
