import { DynamicModule, Module } from '@nestjs/common';
import { DB_MONGO_FACTORY } from './mongo-db.factory';
import { MongoDbConfig } from './mongo-db.interfaces';

@Module({})
export class MongoDriverModule {
    static forRoot(providers: MongoDbConfig[]): DynamicModule {
        /** Фабрика подключения к Mongo */
        const MONGO_DB_PROVIDERS = providers.map(DB_MONGO_FACTORY);
        return {
            global: true,
            module: MongoDriverModule,
            imports: [],
            providers: [...MONGO_DB_PROVIDERS],
            exports: [...MONGO_DB_PROVIDERS],
        };
    }
}
