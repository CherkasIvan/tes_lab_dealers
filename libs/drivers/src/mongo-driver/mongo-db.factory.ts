import { Db, MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { Logger, Provider } from '@nestjs/common';
import { MongoDbConfig } from './mongo-db.interfaces';

/** фабрика создания подключения к Монго*/

export const DB_MONGO_FACTORY = (provide: MongoDbConfig): Provider => ({
    provide: provide.injectToken,
    useFactory: async (configService: ConfigService): Promise<Db> => {
        const connectionString = configService.get<string>(provide.dbUrlEnvironment);
        Logger.debug(
            {
                dbUrlEnvironment: provide.dbUrlEnvironment,
                connectionString,
            },
            'Init mongo',
        );
        if (!connectionString) {
            throw new Error(`ENV: '${provide.dbUrlEnvironment}' not found. Check '.env' file or server variables.`);
        }
        Logger.debug('before URL');
        const connectionUrl = new URL(connectionString);

        Logger.debug('after URL');
        const dbName = connectionUrl.pathname.replace('/', '');
        Logger.verbose(
            `The application connects to the mongoDb database: (${connectionUrl.hostname}:${connectionUrl.port}/${dbName})...`,
            'CONNECTION MONGO',
        );
        const connection = new MongoClient(connectionString);
        const connect = await connection.connect().catch((error) => {
            if (error.message.indexOf('ECONNREFUSED') !== -1) {
                throw {
                    ...error,
                    message: 'Error: The server was not able to reach MongoDB. Maybe it\'s not running?\n' + error.message,
                };
            } else {
                throw error;
            }
        });
        Logger.verbose(`The application is connected to the mongoDb database ${dbName}.`, 'CONNECTION MONGO');
        return connect.db(dbName);
    },
    inject: [ConfigService],
});
