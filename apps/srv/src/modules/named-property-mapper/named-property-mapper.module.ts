import { Module } from '@nestjs/common';
import { NamedPropertyMapperService } from './named-property-mapper.service';
import { NamedPropertyRepository } from './repository/named-property.repository';

@Module({
    providers: [NamedPropertyMapperService, NamedPropertyRepository],
    exports: [NamedPropertyMapperService],
})
export class NamedPropertyMapperModule {}
