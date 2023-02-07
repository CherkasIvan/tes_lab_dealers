import {ColumnDefinitions, PgLiteral, PgType} from "node-pg-migrate";

export const ID_UUID_FIELD: ColumnDefinitions = {
    id: {
        type: PgType.UUID,
        default: new PgLiteral('uuid_generate_v4()'),
        primaryKey: true,
        unique: true,
    },
};
