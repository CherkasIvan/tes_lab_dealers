import moment from 'moment';
import { Moment } from 'moment/moment';

export type PgCallNamedType = 'fn' | 'update';

export interface PgPropItem {
    name: string;
    value: string | number | Date | Moment | unknown;
    type: 'string' | 'boolean' | 'date' | 'dateTime' | 'time' | 'json' | 'num';
}

export function pgCallNamed(propItem: PgPropItem, opType: PgCallNamedType = 'fn'): string|null {
    const quotes = '\'';
    const operator = opType === 'fn' ? '=>' : opType === 'update' ? '=' : '=';
    switch (propItem.type) {
        case 'boolean':
            return `${propItem.name} ${operator} ${propItem.value === true ? 'true' : propItem.value === false ? 'false' : null}`;

        case 'num':
            return `${propItem.name} ${operator} ${propItem.value === null ? null : propItem.value}`;

        case 'json':
            return `${propItem.name} ${operator} ${propItem.value === null ? '{}' : quotes + JSON.stringify(propItem.value) + quotes}`;

        case 'date':
            return `${propItem.name} ${operator} ${
                propItem.value === null ? 'null' : quotes + moment(propItem.value as string).format('YYYY-MM-DD') + quotes
            }`;

        case 'dateTime':
            return `${propItem.name} ${operator} ${
                propItem.value === null ? 'null' : quotes + moment(propItem.value as string).format('YYYY-MM-DD HH:mm:ss') + quotes
            }`;

        case 'time':
            return `${propItem.name} ${operator} ${
                propItem.value === null ? 'null' : quotes + moment(propItem.value as string).format('HH:mm:ss') + quotes
            }`;

        case 'string':
            // eslint-disable-next-line eqeqeq
            return `${propItem.name} ${operator} ${propItem.value == null ? 'null' : quotes + propItem.value + quotes}`;

        default:
            return null;
    }
}
