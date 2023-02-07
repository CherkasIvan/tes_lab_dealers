import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AutostatConfigDto } from './dto/autostat-config.dto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppConfigFacade } from '@app/domains';

@Injectable()
export class AutostatConfigService implements OnApplicationBootstrap {
    private readonly logger = new Logger(AutostatConfigService.name);

    constructor(private readonly settingsFacade: AppConfigFacade) {}

    async onApplicationBootstrap(): Promise<void> {
        const config = await this.settingsFacade.get<AutostatConfigDto>({ ident: 'autostat' }).catch(() => null);
        if (!config?.value) {
            this.logger.warn('autostat config is empty, creating default...');
            await this.settingsFacade.create({
                ident: 'autostat',
                name: 'autostat-auth',
                value: {
                    login: 'tes.store',
                    authUrl: 'https://auth.autostat.ru',
                    dataUrl: 'https://sq.autostat.ru',
                    password: 'password',
                    cacheExpirationSeconds: 0,
                },
                group: 'auth',
                type: 'credentials',
            });
        }
    }

    async get(): Promise<AutostatConfigDto> {
        const config = await this.settingsFacade.get<AutostatConfigDto>({ ident: 'autostat' });
        const dto = plainToClass(AutostatConfigDto, config?.value);

        try {
            await validateOrReject(dto);
        } catch (errors) {
            this.logger.debug(`autostat config: ${JSON.stringify(config)}`);
            this.logger.error(`Autostat config is not valid: ${errors}`);
            throw new Error(`Autostat config is not valid: ${errors}`);
        }

        return dto;
    }

    isCacheExpired(config: AutostatConfigDto, cacheDate?: Date): boolean {
        if (!config.cacheExpirationSeconds || !cacheDate) {
            return false;
        }

        const cacheDateSeconds = cacheDate.getTime() / 1000;
        const cacheExpirationDate = new Date((cacheDateSeconds + config.cacheExpirationSeconds) * 1000);
        const now = new Date();

        return now >= cacheExpirationDate;
    }
}
