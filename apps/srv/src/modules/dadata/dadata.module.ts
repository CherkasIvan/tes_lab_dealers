import { Module } from '@nestjs/common';
import { DadataChannelModule } from '../../channels/dadata/dadata-channel.module';
import { DadataService } from './dadata.service';

@Module({
    imports: [DadataChannelModule],
    providers: [DadataService],
    exports: [DadataService],
})
export class DadataModule {}
