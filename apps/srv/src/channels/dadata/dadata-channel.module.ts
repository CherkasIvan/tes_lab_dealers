import { Module } from '@nestjs/common';
import { DadataPublisher } from './dadata.publisher';

@Module({
    providers: [DadataPublisher],
    exports: [DadataPublisher],
})
export class DadataChannelModule {}
