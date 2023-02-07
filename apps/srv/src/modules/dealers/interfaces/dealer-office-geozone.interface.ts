import { GeozoneAddContract } from '@mobility/amqp-contracts';
import GeoZoneBaseType = GeozoneAddContract.GeoZoneBaseType;

export interface DealerOfficeGeozone extends GeoZoneBaseType{
    color?: string;
    externalId?: string;
}
