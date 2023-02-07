import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CatalogsGetGuidsInfoByOcn } from '@mobility/amqp-contracts';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class OcnPublisher {
    constructor(private readonly amqp: AmqpConnection) {}

    getCatalogDataByOCN(ocn: string): Promise<CatalogsGetGuidsInfoByOcn.Guid | null>;
    getCatalogDataByOCN(ocn: string[]): Promise<Map<string, CatalogsGetGuidsInfoByOcn.Guid> | null>;
    getCatalogDataByOCN(
        ocn: string | string[],
    ): Promise<null | CatalogsGetGuidsInfoByOcn.Guid | Map<string, CatalogsGetGuidsInfoByOcn.Guid>> {
        return this.amqp
            .request<CatalogsGetGuidsInfoByOcn.response>({
                exchange: CatalogsGetGuidsInfoByOcn.queue.exchange.name,
                routingKey: CatalogsGetGuidsInfoByOcn.queue.routingKey,
                payload: {
                    payload: {
                        ocn: Array.isArray(ocn) ? ocn : [ocn],
                    },
                    requestId: randomStringGenerator(),
                },
            })
            .then((result) => {
                const payload = result.payload;
                if (payload.length === 0) {
                    return null;
                }

                if (!Array.isArray(ocn)) {
                    return payload[0];
                }

                const resultMap = new Map<string, CatalogsGetGuidsInfoByOcn.Guid>();
                for (const item of payload) {
                    resultMap.set(item.ocn.ocnCode, item);
                }
                return resultMap;
            });
    }
}
