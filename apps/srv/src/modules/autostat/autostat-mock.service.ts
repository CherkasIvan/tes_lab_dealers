import { Injectable, Logger } from '@nestjs/common';
import { AutostatConfigDto } from './dto/autostat-config.dto';
import { AutostatQuery } from './abstract/autostat-query';
import { AUTOSTAT_GET_DATA_RESPONSE_MOCK } from './mocks/autostat-get-data-response.mock';
import { AUTOSTAT_GET_PRICE_RESPONSE_MOCK } from './mocks/autostat-get-price-response.mock';
import { Autostat } from './autostat.interfaces';

@Injectable()
export class AutostatMockService extends AutostatQuery {
    private readonly logger = new Logger(AutostatMockService.name);

    async decodeVin(payload: Autostat.VinDecoderRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse> {
        this.logger.debug(`getData(${payload.vin}, ${JSON.stringify(config)})`);
        return AUTOSTAT_GET_DATA_RESPONSE_MOCK(payload.vin);
    }

    async getPrice(payload: Autostat.GetPriceRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse> {
        this.logger.debug(`getPrice(${payload.vin}, ${JSON.stringify(config)})`);
        return { ...AUTOSTAT_GET_PRICE_RESPONSE_MOCK };
    }
}
