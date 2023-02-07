import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfigFacade } from '@app/domains';
import { InternalLogger } from '@app/common';
import { BluelinkConfigDto } from './dto/bluelink-config.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class BluelinkConfigService implements OnApplicationBootstrap {
    constructor(private readonly settingsFacade: AppConfigFacade) {}

    private readonly logger = new InternalLogger(BluelinkConfigService.name);

    async onApplicationBootstrap(): Promise<void> {
        const config = await this.settingsFacade.get<BluelinkConfigDto>({ ident: 'bluelink' }).catch(() => null);
        if (!config?.value) {
            this.logger.warn('bluelink config is empty, creating default...');
            await this.settingsFacade.create({
                ident: 'bluelink',
                name: 'bluelink-config',
                value: {
                    url: 'http://192.168.100.30:30078/api/tms/v1/opendata',
                    brandHeader: 'H',
                    hostHeader: '10.107.19.111:18078',
                    cacheExpirationSeconds: 0,
                } as BluelinkConfigDto,
                group: 'auth',
                type: 'credentials',
            });
        }
    }

    async get(): Promise<BluelinkConfigDto> {
        const config = await this.settingsFacade.get<BluelinkConfigDto>({ ident: 'bluelink' });
        const dto = plainToClass(BluelinkConfigDto, config?.value);

        try {
            await validateOrReject(dto);
        } catch (errors) {
            this.logger.debug(`bluelink config: ${JSON.stringify(config)}`);
            this.logger.error(`bluelink config is not valid: ${errors}`);
            throw new Error(`bluelink config is not valid: ${errors}`);
        }

        return dto;
    }
}
