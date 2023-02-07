import { Module } from '@nestjs/common';
import { AutostatModule } from '../../modules/autostat/autostat.module';
import { AutostatControllerService } from './autostat-controller.service';
import { AutostatController } from './autostat.controller';

@Module({
    imports: [AutostatModule],
    controllers: [AutostatController],
    providers: [AutostatControllerService],
})
export class AutostatControllerModule {}
