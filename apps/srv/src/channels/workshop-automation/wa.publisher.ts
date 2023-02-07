import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import * as util from 'util';
import { WAVehicleInfoResponseDto } from './dto';
import { InternalLogger } from '@app/common';

@Injectable()
export class WaPublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    private readonly logger = new InternalLogger(WaPublisher.name);

    getVinReport(vin: string): Promise<WAVehicleInfoResponseDto | null> {
        return this.amqp
            .request<WAVehicleInfoResponseDto | { error: unknown }>({
                exchange: 'wa-provider',
                routingKey: 'vehicle_info',
                payload: {
                    vin,
                },
            })
            .then((response) => {
                if ('error' in response) {
                    this.logger.error(`getVehicleFromWA error, ${util.inspect(response.error)}`);
                    return null;
                }
                return response;
            });
    }
}
