import { Module } from '@nestjs/common';
import { WaService } from './wa.service';
import { WorkshopAutomationChannelModule } from '../../channels/workshop-automation/workshop-automation-channel.module';
import { WaReportRepository } from './repository/wa-report.repository';

@Module({
    imports: [WorkshopAutomationChannelModule],
    providers: [WaService, WaReportRepository],
    exports: [WaService],
})
export class WaModule {}
