import { Controller, Get, UseInterceptors } from '@nestjs/common';
import * as protobuf from 'protobufjs';
import { ApiTags } from '@nestjs/swagger';
import { WrapResponseInterceptor } from '@app/common/interceptors/common-response-wrapper.interceptor';
import {
    DealersControllersEnum,
    DealersInfoHealthcheckGetEndpoint,
    DealersInfoProtobufDescriptorGetEndpoint,
} from '@mobility/apps-dto/dist/services/dealers';

@UseInterceptors(WrapResponseInterceptor)
@ApiTags(DealersControllersEnum.Info)
@Controller(DealersControllersEnum.Info)
export class InfoController {
    @Get(DealersInfoProtobufDescriptorGetEndpoint.endPointPath)
    getProtobufDescriptor(): DealersInfoProtobufDescriptorGetEndpoint.ResponseData {
        return protobuf.roots.decorated.toJSON();
    }

    @Get(DealersInfoHealthcheckGetEndpoint.endPointPath)
    healthCheck(): DealersInfoHealthcheckGetEndpoint.ResponseData {
        return {
            backend: 'ok',
        };
    }
}
