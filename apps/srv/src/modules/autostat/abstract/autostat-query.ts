import { AutostatConfigDto } from '../dto/autostat-config.dto';
import { Autostat } from '../autostat.interfaces';

export abstract class AutostatQuery {
    public abstract decodeVin(payload: Autostat.VinDecoderRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse>;
    public abstract getPrice(payload: Autostat.GetPriceRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse>;
}
