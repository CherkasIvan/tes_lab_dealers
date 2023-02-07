import { InjectionToken } from '@nestjs/common';

export interface AmqpProviderConfigInterface {
    /** Inject token for db service */
    injectToken: InjectionToken;

    /** Config ident contain url connect string */
    configIdent: string;
}
