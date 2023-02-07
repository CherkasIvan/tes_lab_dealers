export type AppConfigValue = {
    [key: string]: unknown;
};

export interface AppConfigEntity<T extends AppConfigValue = AppConfigValue> {
    /** Название */
    name: string;
    /** Группа */
    group: string;
    /** Тип  */
    type: string;
    /** Уникальный код */
    ident: string;
    /** Значение */
    value: T;
    /** Дата добавления */
    createdAt: string;
    /** Дата обновления */
    updatedAt: string;
}
