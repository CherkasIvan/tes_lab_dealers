import { Injectable } from '@nestjs/common';
import { NamedPropertyRepository } from './repository/named-property.repository';
import { NamedPropertyModel } from './models';

@Injectable()
export class NamedPropertyMapperService {
    constructor(private readonly repository: NamedPropertyRepository) {}

    private async createNew(scope: string, code: string | null, value: string | null): Promise<NamedPropertyModel> {
        const newValue = value || code || '';
        const newModel = {
            scope,
            code,
            value: newValue,
            namedProperty: {
                code,
                name: newValue,
                color: null,
            },
            localizedProperty: {
                ru: newValue,
                en: newValue,
            },
        };
        await this.repository.save(newModel);
        return newModel;
    }

    async getByScopeAndCode(scope: string, code: string): Promise<NamedPropertyModel> {
        const entry = await this.repository.findOne({ scope, code });
        if (!entry) {
            return this.createNew(scope, code, null);
        }
        return entry;
    }

    async getByScopeAndValue(scope: string, value: string): Promise<NamedPropertyModel> {
        const entry = await this.repository.findOne({ scope, value });
        if (!entry) {
            return this.createNew(scope, null, value);
        }
        return entry;
    }
}
