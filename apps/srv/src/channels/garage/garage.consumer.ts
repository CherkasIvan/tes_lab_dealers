import { Injectable } from '@nestjs/common';
import { MessageHandlerErrorBehavior, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CarSaleApplicationEventContract } from '@mobility/amqp-contracts';
import { CarSaleService } from '../../modules/car-sale/car-sale.service';

@Injectable()
export class GarageConsumer {
    constructor(private readonly carSaleService: CarSaleService) { }

    @RabbitSubscribe({
        exchange: CarSaleApplicationEventContract.queue.exchange.name,
        routingKey: CarSaleApplicationEventContract.queue.routingKey,
        queue: CarSaleApplicationEventContract.queue.queue,
        errorBehavior: MessageHandlerErrorBehavior.REQUEUE,
        createQueueIfNotExists: true,
        queueOptions: {
            durable: true,
        },
    })
    async carSaleEventHandler(
        message: CarSaleApplicationEventContract.request | CarSaleApplicationEventContract.RequestPayload,
    ): Promise<void> {
        const payload = 'payload' in message ? message.payload : message;
        await this.carSaleService.handleNewCarSaleEvent(
            payload.id,
            payload.vin,
            payload.customerId,
            new Date(payload.publicationDate),
            payload.customerPhoneNumber,
        );
    }
}
