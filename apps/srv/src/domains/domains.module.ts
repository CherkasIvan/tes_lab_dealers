import { Global, Module } from '@nestjs/common';
import { AppConfigDomainModule } from '@app/domains';
import { MongoAppConfigAdapter } from '../adapters/app-config/mongo-app-config.adapter';

@Global()
@Module({
    imports: [
        AppConfigDomainModule.forRoot({
            repository: MongoAppConfigAdapter,
        }),
    ],
    exports: [AppConfigDomainModule],
})
export class DomainsModule {}
