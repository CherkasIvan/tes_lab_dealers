import { Module } from '@nestjs/common';
import { CarSaleModule } from '../../modules/car-sale/car-sale.module';
import { CarSaleController } from './car-sale.controller';
import { CarSaleControllerService } from './car-sale-controller.service';
import { DealersModule } from '../../modules/dealers/dealers.module';

@Module({
    imports: [CarSaleModule, DealersModule],
    controllers: [CarSaleController],
    providers: [CarSaleControllerService],
})
export class CarSaleControllerModule { }
