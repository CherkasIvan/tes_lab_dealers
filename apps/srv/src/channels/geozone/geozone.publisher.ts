import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
    GeozoneAddContract,
    GeozoneBindContract,
    GeozoneDeleteContract,
    GeozoneEventsContract,
} from '@mobility/amqp-contracts';
import { getRequestId } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import GeoZoneBaseType = GeozoneAddContract.GeoZoneBaseType;
import { plainToClass } from 'class-transformer';
import {
    AddCircleGeoZoneDto,
    AddPolygonGeoZoneDto,
} from '../../modules/dealers/dto/add-geo-zone.dto';
import GeoZoneType = GeozoneAddContract.GeoZoneType;
import { CollectEventsContract } from '@mobility/amqp-contracts/dist/queues/geozone/collect-geozone-events.contract';

@Injectable()
export class GeozonePublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    getCarReports(deviceIds: string[], dateStart: number, dateEnd = new Date().getTime() / 1000): Promise<GeozoneEventsContract.ResponsePayload> {
        const request: GeozoneEventsContract.message = {
            payload: {
                deviceIds,
                dateStart,
                dateEnd,
            },
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<GeozoneEventsContract.response>({
                exchange: GeozoneEventsContract.queue.exchange.name,
                routingKey: GeozoneEventsContract.queue.routingKey,
                payload: request,
                correlationId: getRequestId(),
            })
            .then((response) => response.payload);
    }

    async addGeozone(geozone: GeoZoneBaseType): Promise<string | undefined>  {
        let payload;
        switch (geozone.type) {
            case GeoZoneType.Circle:
                payload = plainToClass(AddCircleGeoZoneDto, geozone);
                break;
            case GeoZoneType.Polygon:
                payload = plainToClass(AddPolygonGeoZoneDto, geozone);
                break;
            default:
                return undefined;
        }
        const request: GeozoneAddContract.message = {
            payload,
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<GeozoneAddContract.response>({
                exchange: GeozoneAddContract.queue.exchange.name,
                routingKey: GeozoneAddContract.queue.routingKey,
                payload: request,
                correlationId: getRequestId(),
            })
            .then((response) => response.payload.result?.geoZoneId);
    }

    async deleteGeozones(geoZoneIds: string[]): Promise<GeozoneDeleteContract.ResponsePayload>  {
        const request: GeozoneDeleteContract.message = {
            payload: {
                geoZoneIds,
            },
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<GeozoneDeleteContract.response>({
                exchange: GeozoneDeleteContract.queue.exchange.name,
                routingKey: GeozoneDeleteContract.queue.routingKey,
                payload: request,
                correlationId: getRequestId(),
            })
            .then((response) => response.payload);
    }

    async bindGeozones(geoZoneIds: string[], deviceIds: string[]): Promise<GeozoneBindContract.ResponsePayload>  {
        const request: GeozoneBindContract.message = {
            payload: {
                geoZoneIds,
                deviceIds,
            },
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .request<GeozoneBindContract.response>({
                exchange: GeozoneBindContract.queue.exchange.name,
                routingKey: GeozoneBindContract.queue.routingKey,
                payload: request,
                correlationId: getRequestId(),
            })
            .then((response) => response.payload);
    }

    async collectEvents(payload: CollectEventsContract.RequestPayload) {
        const request: CollectEventsContract.message = {
            payload,
            requestId: getRequestId() || randomStringGenerator(),
            type: 'request',
            timestamp: new Date(),
        };
        return this.amqp
            .publish(
                CollectEventsContract.queue.exchange.name,
                CollectEventsContract.queue.routingKey,
                request
            );
    }
}
