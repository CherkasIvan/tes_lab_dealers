import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { GetCustomerProfileContract } from '@mobility/amqp-contracts';
import { getRequestId } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class MasterUserPublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    getCustomer(customerId: string): Promise<GetCustomerProfileContract.ResponsePayload | null> {
        return this.amqp
            .request<GetCustomerProfileContract.response>({
                exchange: GetCustomerProfileContract.queue.exchange.name,
                routingKey: GetCustomerProfileContract.queue.routingKey,
                payload: {
                    payload: { customerId },
                    requestId: getRequestId() || randomStringGenerator(),
                    type: 'request',
                    timestamp: new Date(),
                } as GetCustomerProfileContract.request,
            })
            .then((response) => response.payload);
    }
}
