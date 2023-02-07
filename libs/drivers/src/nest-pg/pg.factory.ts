import {
    Pool,
    PoolClient,
    PoolConfig,
} from 'pg';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const PG_CONNECTOR_FACTORY = (configIdent: string) => ({
    provide: Pool,
    useFactory: async (configService: ConfigService): Promise<Pool> => {
        const logger = new Logger('PG_CONNECTOR factory');
        const connectConfig: PoolConfig | undefined = configService.get<PoolConfig>(configIdent);
        if (!connectConfig) {
            throw new Error('Pg connection config miss');
        }
        const pool = new Pool(connectConfig);
        if (!connectConfig?.connectionString) {
            connectConfig.connectionString = `postgres:${ connectConfig.host }/${ connectConfig.database }`;
        }
        const dbURL = new URL(connectConfig.connectionString);
        logger.verbose(`PG ${ dbURL.protocol }//${ dbURL.host }${ dbURL.pathname } connecting...`);
        const connect: PoolClient = await pool.connect();
        connect.release(true);
        logger.log('PG Connected.');
        return pool;
    },
    inject: [ ConfigService ],
});
