import { Module } from '@nestjs/common';
import { OcnPublisher } from './ocn.publisher';

@Module({
    providers: [OcnPublisher],
    exports: [OcnPublisher],
})
export class OcnChannelModule {}
