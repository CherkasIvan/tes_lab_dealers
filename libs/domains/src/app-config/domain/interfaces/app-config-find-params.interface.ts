import { FindParams } from '@app/common';
import { AppConfigFilters } from './app-config-filters.interface';
import { AppConfigSorting } from './app-config-sorting.interface';

export type AppConfigFindParams = FindParams<AppConfigFilters, AppConfigSorting>;
