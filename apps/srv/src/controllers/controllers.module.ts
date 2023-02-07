import { Module } from '@nestjs/common';
import { DealerOfficeControllerModule } from './dealer-office/dealer-office-controller.module';
import { AutostatControllerModule } from './autostat/autostat-controller.module';
import { DevControllerModule } from './dev/dev-controller.module';
import { FeedbackControllerModule } from './feedback/feedback-controller.module';
import { CarSaleControllerModule } from './car-sale/car-sale-controller.module';
import { InfoControllerModule } from './info/info.controller-module';

@Module({
    imports: [
        // AppConfigControllersModule,
        DealerOfficeControllerModule,
        AutostatControllerModule,
        DevControllerModule,
        FeedbackControllerModule,
        CarSaleControllerModule,
        InfoControllerModule,
    ],
})
export class ControllersModule {}
