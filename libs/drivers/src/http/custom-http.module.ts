import { DynamicModule, Module } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AXIOS_INSTANCE_TOKEN } from '@nestjs/axios/dist/http.constants';
import { HttpProxy } from './http-proxy';

@Module({})
export class CustomHttpModule {
    static register(config: AxiosRequestConfig): DynamicModule {
        return {
            module: HttpModule,
            providers: [
                {
                    provide: AXIOS_INSTANCE_TOKEN,
                    useFactory: () => axios.create(config),
                },
                {
                    provide: HttpService,
                    useClass: HttpProxy,
                },
            ],
            exports: [AXIOS_INSTANCE_TOKEN, HttpService],
        };
    }
}
