import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { BOOTSTRAP_CONFIG, BootstrapConfig } from './configs/bootstrap-config';
import { MAIN_CONFIG } from './main.config';
import { LongRequestInterceptor, RequestLogInterceptor, swaggerGenerate, requestIdMiddleware, LOGGER_CONFIG } from '@app/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import { environmentInit } from './environment';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(CoreModule, {
        cors: { origin: '*' },
        logger: WinstonModule.createLogger(LOGGER_CONFIG(MAIN_CONFIG.serviceName)),
    });
    const logger = app.get(Logger);
    const configService = app.get(ConfigService);
    environmentInit(configService);
    // get configs
    const bootstrapConfig: BootstrapConfig = BOOTSTRAP_CONFIG(app);
    // set limits
    app.use(json({ limit: bootstrapConfig.jsonLimit }));
    // set middlewares
    app.use(compression(), requestIdMiddleware);
    // set compression
    // app.use(compression());
    // global interceptors
    app.useGlobalInterceptors(
        new LongRequestInterceptor(),
        new RequestLogInterceptor({
            disableRequestLog: bootstrapConfig.disableRequestLogs,
        }),
    );
    // global guards
    // app.useGlobalGuards(new ProjectIdGuard());
    // global validators
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // swagger
    swaggerGenerate(app, bootstrapConfig);
    // listen
    await app.listen(bootstrapConfig.port);
    logger.log(`Application version ${bootstrapConfig.version} start on http://localhost:${bootstrapConfig.port}/`);
}

bootstrap();
