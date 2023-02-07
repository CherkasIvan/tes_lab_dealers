import { Global, Module } from '@nestjs/common';
import { AppConfigAdapterModule } from './app-config/app-config-adapter.module';

const ADAPTER_MODULES = [
    AppConfigAdapterModule,
];

@Global()
@Module({
    imports: [...ADAPTER_MODULES],
    exports: [...ADAPTER_MODULES],
})
export class AdaptersModule {
}
