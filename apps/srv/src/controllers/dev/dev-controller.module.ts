import { Module } from '@nestjs/common';
import { DealersModule } from '../../modules/dealers/dealers.module';
import { WaModule } from '../../modules/workshop-automation/wa.module';
import { OcnCatalogModule } from '../../modules/ocn-catalog/ocn-catalog.module';
import { AutostatModule } from '../../modules/autostat/autostat.module';
import { DevController } from './dev.controller';
import { DevControllerService } from './dev-controller.service';
import { BluelinkModule } from '../../modules/bluelink/bluelink.module';

@Module({
    imports: [DealersModule, WaModule, OcnCatalogModule, AutostatModule, BluelinkModule],
    controllers: [DevController],
    providers: [DevControllerService],
})
export class DevControllerModule {}
