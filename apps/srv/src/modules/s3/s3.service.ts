import { S3Publisher } from '../../channels/s3/s3.publisher';
import { S3FileDataInterface } from './interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
    constructor(private readonly publisher: S3Publisher) {}

    async listFilesInBucket(bucket: string): Promise<S3FileDataInterface[]> {
        const fileList = await this.publisher.listFiles(bucket);
        const result = fileList?.result?.files;
        if (!result) {
            return [];
        }
        return result;
    }

    async getFileUrl(bucket: string, filename: string): Promise<string | null> {
        const result = await this.publisher.getFileUrl(bucket, filename);
        return result?.result?.url || null;
    }
}
