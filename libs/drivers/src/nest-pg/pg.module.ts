import {
    Global,
    Module,
} from '@nestjs/common';
import { PgClientService } from './pg-client.service';
import { PG_CONNECTOR_FACTORY } from './pg.factory';
import { Pool } from 'pg';

@Global()
@Module({
    imports: [],
    providers: [
        PG_CONNECTOR_FACTORY('PG_MAIN'),
        PgClientService,
    ],
    exports: [
        Pool,
        PgClientService,
    ],
})
export class PgModule {
}
