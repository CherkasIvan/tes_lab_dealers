import { Module } from '@nestjs/common';
import { NotificationChannelModule } from '../../channels/notification/notification-channel.module';
import { NotificationService } from './notification.service';

@Module({
    imports: [NotificationChannelModule],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
