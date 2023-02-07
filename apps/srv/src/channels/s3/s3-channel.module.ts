import { Module } from '@nestjs/common';
import { S3Publisher } from './s3.publisher';

@Module({
    providers: [S3Publisher],
    exports: [S3Publisher],
})
export class S3ChannelModule {}
