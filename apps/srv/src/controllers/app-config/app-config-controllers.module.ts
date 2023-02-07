import { Module } from '@nestjs/common';
import { AppConfigController } from './app-config.controller';
import { AppConfigsController } from './app-configs.controller';

@Module({
    controllers: [
        AppConfigController,
        AppConfigsController,
    ],
})
export class AppConfigControllersModule {
}
