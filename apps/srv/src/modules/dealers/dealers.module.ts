import { forwardRef, Module } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { DealersRepository } from './repositories/dealers.repository';
import { CsvDumpParserUtil } from './utils/csv-dump-parser.util';
import { DealersCronService } from './dealers-cron.service';
import { VehicleRepository } from './repositories/vehicle.repository';
import { DadataModule } from '../dadata/dadata.module';
import { AutostatModule } from '../autostat/autostat.module';
import { DealersListenerService } from './dealers-listener.service';
import { WaModule } from '../workshop-automation/wa.module';
import { OcnCatalogModule } from '../ocn-catalog/ocn-catalog.module';
import { BluelinkModule } from '../bluelink/bluelink.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
    imports: [DadataModule, AutostatModule, WaModule, forwardRef(() => OcnCatalogModule), BluelinkModule, VehicleModule],
    providers: [DealersService, DealersRepository, CsvDumpParserUtil, DealersCronService, VehicleRepository, DealersListenerService],
    exports: [DealersService],
})
export class DealersModule {}
