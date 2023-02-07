import { Injectable, Logger } from '@nestjs/common';
import { AutostatConfigDto } from './dto/autostat-config.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { AutostatConfigService } from './autostat-config.service';
import { AutostatQuery } from './abstract/autostat-query';
import { AutostatRequestService } from './autostat-request.service';
import { Autostat } from './autostat.interfaces';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class AutostatQueryService extends AutostatQuery {
    private readonly logger = new Logger(AutostatQueryService.name);

    private token: string | null = null;
    private tokenExp: number | null = null;

    constructor(
        private readonly configService: AutostatConfigService,
        private readonly requestService: AutostatRequestService,
        private readonly httpService: HttpService,
    ) {
        super();
    }

    /**
     * Получение данных авто
     */
    public async decodeVin(payload: Autostat.VinDecoderRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse> {
        if (!config) {
            config = await this.configService.get();
        }

        const token = await firstValueFrom(this.auth(config));
        const requestConfig = this.requestService.decodeVin(token, config, payload);

        const request$ = this.httpService.request<Autostat.ResponseDto>(requestConfig).pipe(
            catchError((error) => {
                this.logger.error(`decodeVin processing error: ${error}`);

                if (error instanceof AxiosError && error.response?.status === 401) {
                    return this.forceAuthAndRetry<Autostat.ResponseDto>(config!, requestConfig);
                }

                throw error;
            }),
            map((response) => response.data.data?.executeSQLQuery),
            map((json) => (json ? JSON.parse(json) : null)),
            catchError((error) => {
                this.logger.log('decodeVin request:');
                this.logger.log(requestConfig);
                this.logger.error(`error during decodeVin: ${error}`);
                throw error;
            }),
        );

        return firstValueFrom(request$);
    }

    /**
     * Получение цены авто
     */
    public async getPrice(payload: Autostat.GetPriceRequest, config?: AutostatConfigDto): Promise<Autostat.ParsedResponse> {
        if (!config) {
            config = await this.configService.get();
        }

        const token = await firstValueFrom(this.auth(config));
        const requestConfig = this.requestService.getPrice(token, config, payload);

        const request$ = this.httpService.request<Autostat.ResponseDto>(requestConfig).pipe(
            catchError((error) => {
                this.logger.error(`getPrice processing error: ${error}`);

                if (error instanceof AxiosError && error.response?.status === 401) {
                    return this.forceAuthAndRetry<Autostat.ResponseDto>(config!, requestConfig);
                }

                throw error;
            }),
            map((response) => response.data.data?.executeSQLQuery),
            map((json) => (json ? JSON.parse(json) : null)),
            catchError((error) => {
                this.logger.log('getPrice request:');
                this.logger.log(requestConfig);
                this.logger.error(`error during getPrice: ${error}`);
                throw error;
            }),
        );

        return firstValueFrom(request$);
    }

    /**
     * Авторизация, если токена нет или он скоро истекает
     */
    private auth(config: AutostatConfigDto): Observable<string> {
        if (this.token && this?.tokenExp !== null && this.tokenExp > new Date().getTime() / 1000 - 30) {
            return of(this.token);
        }

        const requestConfig = this.requestService.auth(config);

        return this.httpService.request<Autostat.AuthResponseDto>(this.requestService.auth(config)).pipe(
            map((response) => response.data.data?.generateToken.value || ''),
            tap((token) => {
                this.token = token || null;
                this.tokenExp = token ? this.parseJwt(token).exp : null;
            }),
            catchError((error) => {
                this.logger.log('auth request:}');
                this.logger.log(requestConfig);
                this.logger.error(`error during auth: ${error}`);
                throw error;
            }),
        );
    }

    /**
     * Сбросить токен, авторизоваться и повторить запрос
     * @param config
     * @param request
     * @private
     */
    private forceAuthAndRetry<T>(config: AutostatConfigDto, request: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        this.token = null;
        this.tokenExp = null;

        return this.auth(config).pipe(
            switchMap((token) => {
                request.headers!['token'] = token;
                return this.httpService.request<T>(request);
            }),
        );
    }

    /**
     * Парсинг jwt токена для получения хранимых данных
     * @param token
     * @private
     */
    private parseJwt(token: string): {
        exp: number;
        id: string;
    } {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }
}
