import { Module } from '@nestjs/common';
import { WaModule } from '../workshop-automation/wa.module';
import { OcnCatalogModule } from '../ocn-catalog/ocn-catalog.module';
import { VehiclesChannelModule } from '../../channels/vehicles/vehicles-channel.module';
import { CarSaleService } from './car-sale.service';
import { CarSaleRepository } from './repository/car-sale.repository';
import { VehicleModule } from '../vehicle/vehicle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [WaModule, OcnCatalogModule, VehiclesChannelModule, VehicleModule, NotificationModule],
    providers: [CarSaleService, CarSaleRepository],
    exports: [CarSaleService],
})
export class CarSaleModule {}
