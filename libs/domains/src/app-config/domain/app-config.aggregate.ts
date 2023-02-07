import { AppConfigEntity, AppConfigValue } from '@app/entities';

export class AppConfigAggregate<T extends AppConfigValue = AppConfigValue> implements AppConfigEntity<T> {
    name = '';
    group = '';
    type = '';
    ident = '';
    value: T = {} as T;
    createdAt: string = (new Date()).toISOString();
    updatedAt: string = (new Date()).toISOString();

    constructor(input?: Partial<AppConfigAggregate<T>>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
