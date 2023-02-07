import { Global, Module } from '@nestjs/common';
import { DadataChannelModule } from './dadata/dadata-channel.module';
import { WorkshopAutomationChannelModule } from './workshop-automation/workshop-automation-channel.module';
import { OcnChannelModule } from './ocn/ocn-channel.module';
import { GeozoneChannelModule } from './geozone/geozone-channel.module';
import { CustomerServiceChannelModule } from './customer-service/customer-service-channel.module';
import { S3ChannelModule } from './s3/s3-channel.module';
import { VehiclesChannelModule } from './vehicles/vehicles-channel.module';
import { GarageChannelModule } from './garage/garage-channel.module';
import { MasterUserChannelModule } from './master-user/master-user-channel.module';
import { NotificationChannelModule } from './notification/notification-channel.module';

const channels = [
    DadataChannelModule,
    WorkshopAutomationChannelModule,
    OcnChannelModule,
    GeozoneChannelModule,
    CustomerServiceChannelModule,
    S3ChannelModule,
    VehiclesChannelModule,
    GarageChannelModule,
    MasterUserChannelModule,
    NotificationChannelModule,
];

@Global()
@Module({
    imports: [...channels],
    exports: [...channels],
})
export class ChannelsModule { }
