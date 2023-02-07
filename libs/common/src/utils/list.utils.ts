/**
 * Параметры пагинации
 */
export interface Pagination {
    onPage: number;
    page: number;
}

/**
 *  Параметры сортировки
 */
export interface FindSorting<T extends string = string> {
    field?: T;
    direction?: 'asc' | 'desc';
}

/**
 *  Параметры получения списка
 */
export interface FindParams<FILTERS = {}, SORTING = FindSorting, PAGINATION = Pagination> {
    filters?: FILTERS;
    sorting?: SORTING;
    search?: string;
    pagination?: PAGINATION;
}

/**
 *  Результат получения списка
 */
export interface FindResult<T> {
    rows: T[];
    total: number;
}

export function getPaginationSQL(pagination?: Pagination): string {
    if (!pagination || !pagination.onPage) {
        return '';
    }

    const offset = (+pagination.onPage) * (+pagination.page ?? 0);
    return `limit ${pagination.onPage} offset ${offset}`;
}

export function getSortingSQL<T extends string>(sorting?: FindSorting<T>, mapping?: Record<T, string>): string {
    if (!sorting || !sorting?.field) {
        return '';
    }

    const field = mapping ? mapping[sorting.field] : sorting.field;

    return `order by ${field} ${sorting?.direction ?? 'asc'}`;
}
