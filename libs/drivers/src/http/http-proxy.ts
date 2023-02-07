import { InternalLogger } from '@app/common/logger';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpProxy extends HttpService {
    constructor(private readonly myInstance: AxiosInstance) {
        super(myInstance);
        this.axiosRef.interceptors.request.use(this._interceptRequest.bind(this));
        this.axiosRef.interceptors.response.use(this._interceptOkResponse.bind(this), this._interceptErrorResponse.bind(this));
    }

    protected readonly logger = new InternalLogger(HttpProxy.name);

    /**
     * Расчет времени выполнения
     * @param start - Время начала
     * @static
     * @private
     */
    private static calculateDiffTime(start: string): number {
        const endTime = Date.now();
        const startTime = new Date(start).getTime();

        return endTime - startTime;
    }
    /**
     * Обработчик ошибок, на случай если потребуется что-то еще провернуть с результатом запроса
     * @param error
     * @static
     * @private
     */
    private static handleError(error: AxiosError): unknown {
        throw error;
    }

    /**
     * Перехватчик запроса. Проставляет время начала запроса к серверу
     * @param request
     * @private
     */
    private _interceptRequest(request: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        this.logRequest(request);

        request.headers!['date'] = new Date().toISOString();

        return request;
    }

    /**
     * Перехватчик ответа от сервера
     * Логирует полученный ответ
     * @param response
     * @private
     */
    private _interceptOkResponse(response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
        this.logResponse(response);
        return response;
    }

    /**
     * Перехватчик ошибок от сервера
     * @param error
     * @private
     */
    private _interceptErrorResponse(error: AxiosError) {
        this.logResponseError(error);
        HttpProxy.handleError(error);
        return;
    }

    private logRequest(config: AxiosRequestConfig): void {
        const url = new URL(config.url!);
        const internalPayload = {
            body: config.data,
            params: config.params,
            query: Object.fromEntries(url.searchParams),
            headers: config.headers!,
        };
        const logMessage = `HTTP:HttpService:request:${config.method} ${url.origin}${url.pathname}`;
        this.logger.log(logMessage);
        // this.logger.debug({
        //     message: logMessage,
        //     internalPayload,
        // });
    }

    private logResponse(response: AxiosResponse): void {
        const config = response.config;
        const url = new URL(config.url!);
        const diff = HttpProxy.calculateDiffTime(response.config.headers!['date'] as string);
        const internalPayload = {
            status: response.status,
            statusText: response.statusText,
            responseTime: diff,
        };
        const logMessage = `HTTP:${response.status}:HttpService:response:${config.method} ${url.origin}${url.pathname} in ${diff}ms`;
        this.logger.log({
            message: logMessage,
            internalPayload,
        });
        // this.logger.debug({
        //     message: logMessage,
        //     internalPayload: {
        //         ...internalPayload,
        //         data: response.data,
        //     },
        // });
    }

    private logResponseError(error: AxiosError): void {
        const response = error.response;
        const config = error.config;
        const url = new URL(config.url!);

        const diff = HttpProxy.calculateDiffTime(error.config.headers!['date'] as string);

        const internalPayload = {
            status: response?.status ?? null,
            statusText: response?.statusText ?? null,
            responseTime: diff,
        };

        let logMessage;

        if (!response) {
            logMessage = `HTTP:${error.message}:HttpService:response:${config.method} ${url.origin}${url.pathname} in ${diff}ms`;
        } else {
            logMessage = `HTTP:${response.status}:HttpService:response:${config.method} ${url.origin}${url.pathname} in ${diff}ms`;
        }

        this.logger.warn({
            message: logMessage,
            internalPayload,
        });
        // this.logger.debug({
        //     message: logMessage,
        //     internalPayload: {
        //         ...internalPayload,
        //         data: response?.data,
        //     },
        // });
    }
}
