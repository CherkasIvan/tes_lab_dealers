import { Module } from '@nestjs/common';
import { CustomerServicePublisher } from './customer-service.publisher';

@Module({
    providers: [CustomerServicePublisher],
    exports: [CustomerServicePublisher],
})
export class CustomerServiceChannelModule {}
