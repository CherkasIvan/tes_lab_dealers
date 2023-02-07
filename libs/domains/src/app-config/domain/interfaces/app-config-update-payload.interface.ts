import { AppConfigCreatePayload } from './app-config-create-payload.interface';
import { AppConfigValue } from '@app/entities';

export type AppConfigUpdatePayload<T extends AppConfigValue = AppConfigValue> = Partial<Omit<AppConfigCreatePayload<T>, 'ident'>>;
