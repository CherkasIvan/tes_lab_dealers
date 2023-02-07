import { Injectable, Logger } from '@nestjs/common';
import {
    AppConfigAggregate,
    AppConfigFindParams,
    AppConfigRepository,
    AppConfigWhereUnique,
} from '@app/domains';
import { PgClientService } from '@app/drivers';
import { FindResult, getPaginationSQL, getSortingSQL } from '@app/common';

@Injectable()
export class AppConfigAdapter extends AppConfigRepository {
    private readonly logger = new Logger(AppConfigAdapter.name);

    constructor(
        private readonly pg: PgClientService
    ) {
        super();
    }

    async delete(where: AppConfigWhereUnique): Promise<void> {
        // language=PostgreSQL
        const sql = `
            delete
            from app_configs
            where ident = '${where.ident}'
        `;

        try {
            await this.pg.query(sql);
        } catch (error) {
            this.logger.error(`delete query error ${error}`);
            throw error;
        }
    }

    async find(params: AppConfigFindParams): Promise<FindResult<AppConfigAggregate>> {
        const paginationSQL = getPaginationSQL(params.pagination);
        const sortingSQL = getSortingSQL(params.sorting, {
            name: 'name',
            ident: 'ident',
            group: '"group"',
            type: 'type',
            updatedAt: 'updated_at',
            createdAt: 'created_at',
        });

        // language=PostgreSQL
        const sql = `
            select *, count(1) over () as "totalCount"
            from app_configs ${sortingSQL} ${paginationSQL}
        `;

        try {
            const rows = await this.pg.rows<AppConfigAggregate & { totalCount: string }>(sql) ?? [];

            return {
                rows: rows.map(i => new AppConfigAggregate(i)),
                total: +(rows[0]?.totalCount ?? 0),
            };
        } catch (error) {
            this.logger.error(`find query error ${error}`);
            throw error;
        }
    }

    async findUnique(where: AppConfigWhereUnique): Promise<AppConfigAggregate | null> {
        // language=PostgreSQL
        const sql = `
            select *
            from app_configs
            where ident = '${where.ident}'
        `;

        try {
            const row = await this.pg.row<AppConfigAggregate>(sql);
            return row ? new AppConfigAggregate(row) : null;
        } catch (error) {
            return null;
        }
    }

    async save(aggregate: AppConfigAggregate): Promise<void> {
        // language=PostgreSQL
        const sql = `
            insert into app_configs (name, "group", type, ident, value)
            values ('${aggregate.name}',
                    '${aggregate.group}',
                    '${aggregate.type}',
                    '${aggregate.ident}',
                    '${JSON.stringify(aggregate.value)}')
            on conflict (ident)
                do update set "group" = excluded."group",
                              type    = excluded.type,
                              value   = excluded.value;
        `;

        try {
            await this.pg.query(sql);
        } catch (error) {
            this.logger.error(`save query error ${error}`);
            throw error;
        }
    }
}
