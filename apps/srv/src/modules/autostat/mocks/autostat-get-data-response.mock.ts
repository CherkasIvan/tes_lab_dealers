import { Autostat } from '../autostat.interfaces';

// eslint-disable-next-line max-lines-per-function
export const AUTOSTAT_GET_DATA_RESPONSE_MOCK = (vin: string): Autostat.ParsedResponse => ({
    headers: {
        COLUMNS: [
            {
                value: 'VIN',
                children: [],
            },
            {
                value: 'Марка',
                children: [],
            },
            {
                value: 'Модель',
                children: [],
            },
            {
                value: 'Объем двигателя (л)',
                children: [],
            },
            {
                value: 'Объем двигателя (см3)',
                children: [],
            },
            {
                value: 'Мощность двигателя (лс)',
                children: [],
            },
            {
                value: 'Тип топлива',
                children: [],
            },
            {
                value: 'Тип КПП',
                children: [],
            },
            {
                value: 'Тип привода',
                children: [],
            },
            {
                value: 'Тип кузова',
                children: [],
            },
            {
                value: 'Количество дверей',
                children: [],
            },
            {
                value: 'Расположение руля',
                children: [],
            },
            {
                value: 'Год выпуска',
                children: [],
            },
            {
                value: 'Поколение',
                children: [],
            },
            {
                value: 'Страна производства',
                children: [],
            },
            {
                value: 'Евро-класс',
                children: [],
            },
            {
                value: 'Дата последней регистрации',
                children: [],
            },
            {
                value: 'Дата первой регистрации',
                children: [],
            },
            {
                value: 'Регион последней регистрации',
                children: [],
            },
            {
                value: 'Количество владельцев',
                children: [],
            },
            {
                value: 'Тип последнего владельца',
                children: [],
            },
        ],
    },
    cellSet: [
        [
            vin,
            'KIA',
            'RIO',
            '1.6',
            '1591',
            '122',
            'Бензин',
            'Механика',
            'Передний',
            'Хэтчбек',
            '5',
            'Левый',
            '2020',
            'IV, IV Рестайлинг',
            'Россия',
            'Евро-5',
            '2020-12-17',
            '2020-12-17',
            'Москва',
            '1',
            'Физ. лицо',
        ],
    ],
    size: 1,
    offset: 0,
});
