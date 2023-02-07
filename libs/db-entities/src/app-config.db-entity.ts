export interface AppConfigDbEntity<T = unknown> {
    id: number;
    name: string;
    group: string;
    type: string;
    ident: string;
    value: T;
    createdAt: string;
    updatedAt: string;
}
