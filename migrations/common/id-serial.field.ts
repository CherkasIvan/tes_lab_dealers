import {ColumnDefinitions, PgType} from "node-pg-migrate";

export const ID_SERIAL_FIELD: ColumnDefinitions = {
    id: {
        type: PgType.SERIAL,
        primaryKey: true,
        unique: true,
    },
};
