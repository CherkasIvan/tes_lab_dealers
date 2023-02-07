export interface S3FileDataInterface {
    /** Путь и название файла */
    name: string;
    /** E-Tag */
    etag: string;
    /** Версия файла */
    versionId?: string;
    /** Префикс */
    prefix?: string;
    /** Метаданные */
    metadata: Record<string, string>;
    /** Размер файла */
    size: number;
    /** Время последнего изменения */
    lastModified: Date;
}
