import { Module } from '@nestjs/common';
import { GeozonePublisher } from './geozone.publisher';

@Module({
    providers: [GeozonePublisher],
    exports: [GeozonePublisher],
})
export class GeozoneChannelModule {}
