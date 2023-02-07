import { FindSorting } from '@app/common';
import { AppConfigEntity } from '@app/entities';

type AppConfigSortingField = keyof Omit<AppConfigEntity, 'value'>;

export type AppConfigSorting = FindSorting<AppConfigSortingField>;
