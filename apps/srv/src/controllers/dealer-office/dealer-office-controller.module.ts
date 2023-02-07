import { Module } from '@nestjs/common';
import { DealerOfficeController } from './dealer-office.controller';
import { DealerOfficeControllerService } from './dealer-office-controller.service';
import { DealersModule } from '../../modules/dealers/dealers.module';
import { NamedPropertyMapperModule } from '../../modules/named-property-mapper/named-property-mapper.module';
import { AutostatModule } from '../../modules/autostat/autostat.module';
import { BluelinkModule } from '../../modules/bluelink/bluelink.module';

@Module({
    imports: [DealersModule, NamedPropertyMapperModule, AutostatModule, BluelinkModule],
    controllers: [DealerOfficeController],
    providers: [DealerOfficeControllerService],
})
export class DealerOfficeControllerModule {}
