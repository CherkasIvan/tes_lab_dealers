import { ColumnDefinitions, PgLiteral, PgType } from 'node-pg-migrate';

export const TIMESTAMP_FIELDS: ColumnDefinitions = {
    created_at: {
        type: PgType.TIMESTAMP_WITH_TIME_ZONE,
        notNull: true,
        default: new PgLiteral('NOW()'),
    },
    updated_at: {
        type: PgType.TIMESTAMP_WITH_TIME_ZONE,
        notNull: false,
        default: new PgLiteral('NOW()'),
    },
};
