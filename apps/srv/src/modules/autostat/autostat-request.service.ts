import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { AutostatConfigDto } from './dto/autostat-config.dto';
import { Autostat } from './autostat.interfaces';

@Injectable()
export class AutostatRequestService {
    constructor() {}

    decodeVin(token: string, config: AutostatConfigDto, payload: Autostat.VinDecoderRequest): AxiosRequestConfig {
        const data = {
            query: `query{executeSQLQuery(PageRequest: {size: 1, offset: 0},SQLQuery:{alias:"VINdetail",filters: [{alias: "VIN", values: [ "${payload.vin}" ] }]})}`,
        };

        return {
            url: config.dataUrl,
            method: 'POST',
            data,
            headers: { token },
        };
    }

    getPrice(token: string, config: AutostatConfigDto, payload: Autostat.GetPriceRequest): AxiosRequestConfig {
        const mileage = payload.mileage ?? 0;
        const gearboxkey = payload.gearboxkey ?? 0;
        const statekey = payload.statekey ?? 0;

        const data = {
            query: `query{executeSQLQuery(PageRequest: {size: 1, offset: 0},SQLQuery:{alias:"PriceCalcByVin_4p", filters: [ {alias: "vin", values: [ "'${payload.vin}'" ] }, {alias: "mileage", values: [ "${mileage}" ] },  {alias: "gearboxkey", values: [ "${gearboxkey}" ] }, {alias: "statekey", values: [ "${statekey}" ] } ],})}`,
        };

        return {
            url: config.dataUrl,
            method: 'POST',
            data,
            headers: { token },
        };
    }

    auth(config: AutostatConfigDto): AxiosRequestConfig {
        const data = {
            query: `mutation{generateToken(User:{username:"${config.login}", password:"${config.password}"}){value}}`,
        };

        return {
            url: config.authUrl,
            method: 'POST',
            data,
        };
    }
}
