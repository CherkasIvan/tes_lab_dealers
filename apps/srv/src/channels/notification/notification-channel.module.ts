import { Module } from '@nestjs/common';
import { NotificationPublisher } from './notification.publisher';

@Module({ providers: [NotificationPublisher], exports: [NotificationPublisher] })
export class NotificationChannelModule {}
