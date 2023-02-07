import { Module } from '@nestjs/common';
import { VehiclesConsumer } from './vehicles.consumer';
import { DealersModule } from '../../modules/dealers/dealers.module';
import { VehiclesPublisher } from './vehicles.publisher';

@Module({
    imports: [DealersModule],
    providers: [VehiclesConsumer, VehiclesPublisher],
    exports: [VehiclesPublisher],
})
export class VehiclesChannelModule {}
