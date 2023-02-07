import { ConfigService } from '@nestjs/config';

export const environment = {
    geozoneEventsBatchSize: 10,
};

export const environmentInit = (configService: ConfigService) => {
    environment.geozoneEventsBatchSize = parseInt(configService.get<string>('GEOZONE_EVENTS_BATCH_SIZE', '10'));
};
