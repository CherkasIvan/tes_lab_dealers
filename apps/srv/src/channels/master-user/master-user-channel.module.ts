import { Module } from '@nestjs/common';
import { MasterUserPublisher } from './master-user.publisher';

@Module({
    providers: [MasterUserPublisher],
    exports: [MasterUserPublisher],
})
export class MasterUserChannelModule {}
