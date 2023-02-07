import { S3ChannelModule } from '../../channels/s3/s3-channel.module';
import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
    imports: [S3ChannelModule],
    providers: [S3Service],
    exports: [S3Service],
})
export class S3Module {}
