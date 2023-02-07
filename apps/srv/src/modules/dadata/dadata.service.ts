import { Injectable } from '@nestjs/common';
import { DadataPublisher } from '../../channels/dadata/dadata.publisher';

@Injectable()
export class DadataService {
    constructor(private readonly publisher: DadataPublisher) {}

    async getAddress(lat: number, lon: number): Promise<string> {
        const result = await this.publisher.geolocate(lat, lon, 1000);
        const city = result?.data.city || result?.data.settlement_with_type || null;
        let region = result?.data.region_with_type || null;
        if (
            !!result?.data.region_with_type &&
            !!result?.data.region_with_type !== null &&
            result.data.city_with_type === result.data.region_with_type
        ) {
            // при совпадении региона и города отбрасываю регион
            region = null;
        }
        return [region, city].filter((value) => value !== null).join(', ');
    }
}
