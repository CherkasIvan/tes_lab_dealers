import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { VehicleLastPacketGetContract, VehiclesVehicleGetContract } from '@mobility/amqp-contracts';
import { getRequestId, InternalLogger } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class VehiclesPublisher {
    constructor(private readonly amqp: AmqpConnection) { }

    private readonly logger = new InternalLogger(VehiclesPublisher.name);

    getVehicle(vin: string): Promise<VehiclesVehicleGetContract.ResponsePayload | null> {
        return this.amqp
            .request<VehiclesVehicleGetContract.response>({
                exchange: VehiclesVehicleGetContract.queue.exchange.name,
                routingKey: VehiclesVehicleGetContract.queue.routingKey,
                payload: {
                    payload: { vin },
                    requestId: getRequestId() || randomStringGenerator(),
                    type: 'request',
                    timestamp: new Date(),
                } as VehiclesVehicleGetContract.request,
            })
            .then((response) => response.payload);
    }

    getLastPacket(vin: string): Promise<VehicleLastPacketGetContract.ResponsePayload | null> {
        return this.amqp
            .request<VehicleLastPacketGetContract.response>({
                exchange: VehicleLastPacketGetContract.queue.exchange.name,
                routingKey: VehicleLastPacketGetContract.queue.routingKey,
                payload: {
                    payload: { vin },
                    requestId: getRequestId() || randomStringGenerator(),
                    type: 'request',
                    timestamp: new Date(),
                } as VehicleLastPacketGetContract.request,
            })
            .then((response) => response.payload)
            .catch((e) => {
                this.logger.warn(e.message);
                return null;
            });
    }
}
