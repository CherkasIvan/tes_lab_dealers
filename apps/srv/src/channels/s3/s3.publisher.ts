import { S3MinioGetAllFilesDataContract, S3MinioGetFileUrlContract } from '@mobility/amqp-contracts';
import { Injectable } from '@nestjs/common';
import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { getRequestId, InternalLogger } from '@app/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class S3Publisher {
    constructor(private readonly amqp: AmqpConnection) {}

    private readonly logger = new InternalLogger(S3Publisher.name);

    listFiles(bucket: string): Promise<S3MinioGetAllFilesDataContract.ResponsePayload | null> {
        const requestOptions: RequestOptions = {
            exchange: S3MinioGetAllFilesDataContract.queue.exchange.name,
            routingKey: S3MinioGetAllFilesDataContract.queue.routingKey,
            payload: {
                type: 'request',
                payload: { bucketName: bucket },
                requestId: getRequestId() || randomStringGenerator(),
                timestamp: new Date(),
            } as S3MinioGetAllFilesDataContract.message,
            timeout: 10000,
        };
        return this.amqp
            .request<S3MinioGetAllFilesDataContract.response>(requestOptions)
            .then((data) => data.payload)
            .catch((e) => {
                this.logger.warn(e.message);
                return null;
            });
    }

    getFileUrl(bucket: string, filename: string): Promise<S3MinioGetFileUrlContract.ResponsePayload | null> {
        const requestOptions: RequestOptions = {
            exchange: S3MinioGetFileUrlContract.queue.exchange.name,
            routingKey: S3MinioGetFileUrlContract.queue.routingKey,
            payload: {
                type: 'request',
                payload: { bucketName: bucket, fileName: filename },
                requestId: getRequestId() || randomStringGenerator(),
                timestamp: new Date(),
            } as S3MinioGetFileUrlContract.message,
            timeout: 10000,
        };
        return this.amqp
            .request<S3MinioGetFileUrlContract.response>(requestOptions)
            .then((data) => data.payload)
            .catch((e) => {
                this.logger.warn(e.message);
                return null;
            });
    }
}
