import { Pool, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { Injectable, Logger } from '@nestjs/common';
import { pgCallNamed, PgPropItem } from './pgCallNamed';
import { InCamelCase } from '@app/common';

// export const isDeadLockError = (e) => e?.code === '40P01' || e?.routine === 'DeadLockReport';

@Injectable()
export class PgClientService {
    logger = new Logger(PgClientService.name);

    constructor(private readonly pool: Pool) {}

    @InCamelCase()
    async query<R extends QueryResultRow = Record<string, unknown>, I extends unknown[] = unknown[]>(
        queryTextOrConfig: string | QueryConfig<I>,
        values?: I,
    ): Promise<QueryResult<R>> {
        const connect = await this.pool.connect();
        const result = await connect.query(queryTextOrConfig, values).catch((error) => {
            this.logger.error('Sql query error', {
                queryTextOrConfig,
                values,
                error,
            });
            throw error;
        });
        connect.release(true);
        return result;
    }

    async sfRows<T = unknown>(storedFunction: string, fnProps: PgPropItem[]): Promise<T[] | null> {
        const fnArg = fnProps.map((prop) => pgCallNamed(prop)).join(',');
        const query = `select *
                       from ${storedFunction}(${fnArg})`;
        return (await this.query(query)).rows as T[] | null;
    }

    async sfRow<T = unknown>(storedFunction: string, fnProps: PgPropItem[]): Promise<T | null> {
        const fnArg = fnProps.map((prop) => pgCallNamed(prop)).join(',');
        const query = `select *
                       from ${storedFunction}(${fnArg})`;
        return this.row<T>(query);
    }

    async row<T = unknown>(query: string): Promise<T | null> {
        const queryResult = await this.query(query);
        if (queryResult?.rows?.[0]) {
            return (queryResult.rows[0] as T) ?? null;
        } else {
            throw new Error('Bad query. Empty result.');
        }
    }

    async rows<T = unknown>(query: string): Promise<Array<T>> {
        const queryResult = await this.query(query);
        if (queryResult?.rows) {
            return (queryResult.rows as T[]) ?? [];
        } else {
            throw new Error('Bad query. Empty result.');
        }
    }

    async fnValue<T = unknown>(query: string): Promise<T | null> {
        const rowItem = await this.row<Record<string, T>>(`select ${query} as field`);
        return rowItem?.['field'] ?? null;
    }

    async fieldValue<T = unknown>(query: string, field: string): Promise<T | null> {
        return (await this.row<Record<string, T>>(query))?.[field] ?? null;
    }
}
