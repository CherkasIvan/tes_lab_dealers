import { version, name } from '../../../package.json';

export interface MainConfig {
    /** название сервиса */
    serviceName: string;
    /** Адрес сервера */
    serverUrl: string;

    /** Путь на сервере */
    serverPath: string;
    /** максимальный размер файла */
    jsonLimit: string;
    /** версия приложения */
    version: string;
    /** Название приложения в Swagger */
    swaggerAppTitle: string;
    /** описание Swagger, допустимо Markdown */
    swaggerDescription: string;
}
const serverUrl = 'https://devapi.mobility.hyundai.ru/';
const swaggerDescription = `
### See also:
### [All API documentation](${serverUrl}/apidoc/)
    `;
export const MAIN_CONFIG: MainConfig = {
    serverUrl: serverUrl + 'dealers',
    serverPath: 'dealers',
    serviceName: name + '-srv',
    jsonLimit: '50mb',
    version,
    swaggerAppTitle: 'Dealers service',
    swaggerDescription,
};
