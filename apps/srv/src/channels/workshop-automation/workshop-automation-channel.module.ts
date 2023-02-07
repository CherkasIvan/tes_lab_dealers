import { Module } from '@nestjs/common';
import { WaPublisher } from './wa.publisher';

@Module({
    providers: [WaPublisher],
    exports: [WaPublisher],
})
export class WorkshopAutomationChannelModule {}
