import { Module } from '@nestjs/common';
import { AutostatService } from './autostat.service';
import { HttpModule } from '@nestjs/axios';
import { AutostatQuery } from './abstract/autostat-query';
import { AutostatConfigService } from './autostat-config.service';
import { AutostatMapperService } from './autostat-mapper.service';
import { AutostatQueryService } from './autostat-query.service';
import { AutostatRequestService } from './autostat-request.service';
import { AutostatRepository } from './repository/autostat.repository';

@Module({
    imports: [HttpModule],
    providers: [
        AutostatService,
        AutostatConfigService,
        {
            provide: AutostatQuery,
            useClass: AutostatQueryService,
        },
        AutostatMapperService,
        AutostatRequestService,
        AutostatRepository,
    ],
    exports: [AutostatService],
})
export class AutostatModule {}
