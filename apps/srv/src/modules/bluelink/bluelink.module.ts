import { Module } from '@nestjs/common';
import { CustomerServiceChannelModule } from '../../channels/customer-service/customer-service-channel.module';
import { BluelinkService } from './bluelink.service';
import { BluelinkRepository } from './repository/bluelink.repository';
import { BluelinkConfigService } from './bluelink-config.service';
import { BluelinkQueryService } from './bluelink-query.service';
import { S3Module } from '../s3/s3.module';
import { BluelinkDumpReaderService } from './bluelink-dump-reader.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CustomerServiceChannelModule, HttpModule, S3Module],
    providers: [BluelinkService, BluelinkRepository, BluelinkConfigService, BluelinkQueryService, BluelinkDumpReaderService],
    exports: [BluelinkService],
})
export class BluelinkModule {}
