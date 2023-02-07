import { Module } from '@nestjs/common';
import { GarageConsumer } from './garage.consumer';
import { CarSaleModule } from '../../modules/car-sale/car-sale.module';

@Module({
    imports: [CarSaleModule],
    providers: [GarageConsumer],
})
export class GarageChannelModule {}
