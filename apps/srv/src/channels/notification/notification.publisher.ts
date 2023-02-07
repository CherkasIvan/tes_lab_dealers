import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Email } from '@mobility/amqp-contracts';
import { getRequestId } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class NotificationPublisher {
    constructor(private readonly amqpService: AmqpConnection) {}

    sendMail(payload: Email.RequestPayload): Promise<void> {
        const message: Email.message = {
            payload,
            type: 'request',
            requestId: getRequestId() || randomStringGenerator(),
            timestamp: new Date(),
        };
        return this.amqpService.publish(Email.queue.exchange.name, Email.queue.routingKey, message);
    }
}
