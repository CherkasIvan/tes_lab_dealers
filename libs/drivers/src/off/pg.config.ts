import { ConfigService, registerAs } from '@nestjs/config';
import { PoolConfig } from 'pg';

export const _pgConfig = (configIdent: string, env: string) =>
    registerAs(configIdent, (): PoolConfig => {
        const configService = new ConfigService();
        const connectionString = configService.get<string>(env);
        if (!connectionString) {
            throw new Error(`ENV: '${env}' not found. Check '.env' file or server variables.`);
        }
        return {
            connectionString,
        };
    });
