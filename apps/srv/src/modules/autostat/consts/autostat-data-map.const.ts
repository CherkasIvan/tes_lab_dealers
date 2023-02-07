/* eslint-disable @typescript-eslint/naming-convention */
import { AutostatMap } from '../interfaces/autostat-map.interface';

export const AUTOSTAT_DATA_MAP: AutostatMap = {
    'VIN': 'vin',
    'Марка': 'manufacture',
    'Модель': 'model',
    'Объем двигателя (л)': 'engineVolumeL',
    'Объем двигателя (см3)': 'engineVolumeCm',
    'Мощность двигателя (лс)': 'horsePower',
    'Тип топлива': 'fuelType',
    'Тип КПП': 'transmissionsType',
    'Тип привода': 'gearingType',
    'Тип кузова': 'bodyType',
    'Количество дверей': 'doorCount',
    'Расположение руля': 'steeringWheelLocation',
    'Год выпуска': 'yearOfProduction',
    'Поколение': 'generation',
    'Страна производства': 'country',
    'Евро-класс': 'euroClass',
    'Дата первой регистрации': 'firstRegistrationDate',
    'Дата последней регистрации': 'lastRegistrationDate',
    'Регион последней регистрации': 'lastRegistrationRegion',
    'Количество владельцев': 'ownerCount',
    'Тип последнего владельца': 'lastOwnerType',
};
