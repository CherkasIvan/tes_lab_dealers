import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { MAIN_CONFIG, MainConfig } from '../main.config';

/**
 * Интерфейс настроек приложения
 */
export interface BootstrapConfig extends MainConfig {
    /** Порт приложения */
    port: string;
    /** Признак продакшена */
    isProduct: boolean;
    /** Признак отключения логгирования входящих запросов */
    disableRequestLogs: boolean;
}

/** настройки приложения
 *
 * Репозиторий обращений к process.env
 *
 * @param app Приложение Nest
 */
export const BOOTSTRAP_CONFIG = (app: INestApplication): BootstrapConfig => {
    const configService = app.get(ConfigService);
    const port = configService.get<string>('SERVER_PORT', '3041');
    const isProduct = configService.get<string>('IS_PRODUCT', 'false');
    const disableRequestLogs = configService.get<string>('DISABLE_REQUEST_LOG', 'false');
    return {
        port,
        isProduct: isProduct === 'true',
        disableRequestLogs: disableRequestLogs === 'true',
        ...MAIN_CONFIG,
    };
};
