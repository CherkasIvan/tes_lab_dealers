import { AppConfigEntity, AppConfigValue } from '@app/entities';

export type AppConfigCreatePayload<T extends AppConfigValue = AppConfigValue> = Omit<AppConfigEntity<T>, 'createdAt' | 'updatedAt'>;
