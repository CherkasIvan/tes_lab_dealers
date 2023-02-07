import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CustomerGetBluelinkDevices } from '@mobility/amqp-contracts';
import { getRequestId } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class CustomerServicePublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    getBluelinkDevices(payload: CustomerGetBluelinkDevices.RequestPayload): Promise<CustomerGetBluelinkDevices.ResponsePayload> {
        const { exchange, routingKey } = CustomerGetBluelinkDevices.queue;
        const requestPayload: CustomerGetBluelinkDevices.message = {
            payload,
            exchange: exchange.name,
            requestId: getRequestId() || randomStringGenerator(),
            routingKey,
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<CustomerGetBluelinkDevices.response>({
                exchange: exchange.name,
                routingKey,
                payload: requestPayload,
            })
            .then((response) => response.payload);
    }
}
