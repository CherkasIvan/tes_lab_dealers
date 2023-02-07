/* eslint-disable @typescript-eslint/naming-convention */
import {MigrationBuilder, ColumnDefinitions, PgType} from 'node-pg-migrate';
import {ID_SERIAL_FIELD, TIMESTAMP_FIELDS} from "./common";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    pgm.createTable('app_configs', {
        ...ID_SERIAL_FIELD,
        name: {
            type: PgType.CHARACTER_VARYING,
            notNull: true,
        },
        group: {
            type: PgType.CHARACTER_VARYING,
            notNull: true,
        },
        type: {
            type: PgType.CHARACTER_VARYING,
            notNull: true,
        },
        ident: {
            type: PgType.CHARACTER_VARYING,
            notNull: true,
            unique: true,
        },
        value: {
            type: PgType.JSONB,
            notNull: true,
            default: '{}',
        },
        ...TIMESTAMP_FIELDS,
    }, {
        ifNotExists: true,
        comment: 'Настройки сервиса',
    });

    // language=PostgreSQL
    pgm.sql(`
        CREATE OR REPLACE FUNCTION tg_updated_at()
            RETURNS TRIGGER AS
        $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // language=PostgreSQL
    pgm.sql(`
        CREATE TRIGGER tg_app_configs_updated_at
            BEFORE UPDATE
            ON app_configs
            FOR EACH ROW
        EXECUTE FUNCTION tg_updated_at();
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('app_configs', {ifExists: true});
}
