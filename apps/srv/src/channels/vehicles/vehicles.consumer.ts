import { Injectable } from '@nestjs/common';
import { VEHICLES_EVENT_EXCHANGE, VehiclesEvent, VehiclesVehicleActivationEventContract } from '@mobility/amqp-contracts';
import { MessageHandlerErrorBehavior, Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { DealersService } from '../../modules/dealers/dealers.service';
import { InternalLogger } from '@app/common';

@Injectable()
export class VehiclesConsumer {
    constructor(private readonly dealersService: DealersService) {}

    private readonly logger = new InternalLogger(VehiclesConsumer.name);

    @RabbitSubscribe({
        exchange: VEHICLES_EVENT_EXCHANGE.name,
        routingKey: 'events',
        queue: `${VEHICLES_EVENT_EXCHANGE.name}-dealers`,
        errorBehavior: MessageHandlerErrorBehavior.REQUEUE,
        createQueueIfNotExists: true,
        queueOptions: {
            durable: true,
        },
    })
    async vehiclesEventListener(event: VehiclesEvent): Promise<void> {
        if (event.type === 'vehicle-device-activation') {
            await this.handleActivationEvent(event).catch((error) => {
                this.logger.error(error);
                return new Nack(true);
            });
        }
    }

    async handleActivationEvent(event: VehiclesVehicleActivationEventContract.message): Promise<void> {
        const payload = event.payload;
        await this.dealersService.changeVehicleActivationStatus(payload.vin, payload.active, payload.isMainBlock);
        await this.dealersService.updateLastPacket(payload.vin);
    }
}
