import { Module } from '@nestjs/common';
import { MongoAppConfigAdapter } from './mongo-app-config.adapter';

@Module({
    providers: [MongoAppConfigAdapter],
    exports: [MongoAppConfigAdapter],
})
export class AppConfigAdapterModule {}
