import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DaData, EDaDataRequestType } from '@mobility/amqp-contracts';
import { getRequestId } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DadataSuggestionInterface } from './interfaces/dadata-suggestion.interface';

@Injectable()
export class DadataPublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    async geolocate(lat: number, lon: number, area?: number): Promise<DadataSuggestionInterface | null> {
        const messageData: DaData.message['payload'] = {
            query: EDaDataRequestType.GeolocateAddress,
            body: { lat, lon, radius_meters: area },
        };
        const request: DaData.message = {
            payload: messageData,
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<DaData.response>({
                exchange: DaData.queue.exchange.name,
                routingKey: DaData.queue.routingKey,
                payload: request,
                correlationId: getRequestId(),
            })
            .then((response) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return (response.payload.result?.suggestions[0] as DadataSuggestionInterface) || null;
            });
    }
}
