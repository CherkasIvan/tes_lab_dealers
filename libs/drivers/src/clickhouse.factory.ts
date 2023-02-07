import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClickHouse } from 'clickhouse';

export interface ClickhouseConfig {
    url: string;
    port?: string;
    debug?: boolean;
    basicAuth?: null;
    isUseGzip?: boolean;
    format?: 'json' | 'csv' | 'tsv';
    raw?: boolean;
    config?: {
        session_id?: string;
        session_timeout?: number;
        output_format_json_quote_64bit_integers?: number;
        enable_http_compression?: number;
        database: string;
    };
    // This object merge with request params (see request lib docs)
    reqParams?: Record<string, unknown>;
}

export const CH_CONNECTOR_FACTORY = (configIdent: string) => ({
    provide: ClickHouse,
    useFactory: async (configService: ConfigService): Promise<ClickHouse> => {
        const connectConfig: ClickhouseConfig | undefined = configService.get<ClickhouseConfig>(configIdent);
        if (!connectConfig) {
            throw new Error('Ошибка подключения к БД. нет конфигурации');
        }
        Logger.verbose('Clickhouse Init...', 'Clickhouse_Connection');
        const clickhouse = new ClickHouse(connectConfig);
        Logger.verbose('Clickhouse Init done.', 'Clickhouse_Connection');
        return clickhouse;
    },
    inject: [ ConfigService ],
});
