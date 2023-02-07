import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';
import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerDocumentOptions } from '@nestjs/swagger/dist/interfaces';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { BootstrapConfig } from '../../../apps/srv/src/configs/bootstrap-config';
/** URL по которому будет доступен Swagger */
const SWAGGER_URL = 'api-doc';

export const swaggerGenerate = (app: INestApplication, applicationConfig: BootstrapConfig) => {
    const { port, version, swaggerAppTitle, serverUrl, swaggerDescription } = applicationConfig;
    if (!applicationConfig.isProduct) {
        SwaggerStart(
            app,
            port,
            swaggerAppTitle,

            [
                {
                    url: serverUrl,
                    descr: 'dev server',
                },
                {
                    url: `http://localhost:${port}/`,
                    descr: 'localhost',
                },
            ],
            version,
            swaggerDescription,
        );
    }
};

/** Генератор json файла swagger для экспорта */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const documentSave = (document: OpenAPIObject, optionalUrl: string) => {
    const docPath = path.resolve(`assets/swaggerDoc${optionalUrl.replace('/', '_')}.json`);
    try {
        if (!fs.existsSync(docPath)) {
            fs.closeSync(fs.openSync(docPath, 'w'));
        }
        fs.writeFileSync(docPath, JSON.stringify(document, null, '  '));
    } catch (e) {
        Logger.error('error create swagger', e, 'SWAGGER');
    }
    Logger.log(`document save on ${docPath}`, 'SWAGGER');
};

/**
 * Запуск Swagger
 *
 * @param app - приложение Nest
 * @param port - Порт, где запущено приложение
 * @param title - Заголовок приложения
 * @param servers - URL для вызова API
 * @param version - Версия API
 * @param headDescriptionText - Текст в шапке Swagger
 * @param docOptions - Параметры swagger
 * @constructor
 */
export function SwaggerStart(
    app: INestApplication,
    port: string,
    title = 'SERVICE',
    servers: { url: string; descr: string }[],
    version = '1.0',
    headDescriptionText = '',
    docOptions?: SwaggerDocumentOptions,
) {
    const documentBuilder = new DocumentBuilder().setTitle(title);
    documentBuilder.setDescription(headDescriptionText);
    servers.map((server) => documentBuilder.addServer(server.url, server.descr));
    documentBuilder.setVersion(version).addBearerAuth();
    const doc = SwaggerModule.createDocument(app, documentBuilder.build(), docOptions);
    // documentSave(doc, optionalUrl);
    Logger.log(`swagger: http://localhost:${port}/${SWAGGER_URL}/`, 'SWAGGER');
    SwaggerModule.setup(SWAGGER_URL, app, doc);
    return SWAGGER_URL;
}
