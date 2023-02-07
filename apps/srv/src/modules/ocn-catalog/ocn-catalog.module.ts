import { forwardRef, Module } from '@nestjs/common';
import { OcnCatalogService } from './ocn-catalog.service';
import { OcnChannelModule } from '../../channels/ocn/ocn-channel.module';
import { OcnCatalogRepository } from './repository/ocn-catalog.repository';
import { DealersModule } from '../dealers/dealers.module';

@Module({
    imports: [OcnChannelModule, forwardRef(() => DealersModule)],
    providers: [OcnCatalogService, OcnCatalogRepository],
    exports: [OcnCatalogService],
})
export class OcnCatalogModule {}
