import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
// import { FeedbackControllerService } from './feedback-controller.service';
// import { CreateFeedbackRequestDto, GetFeedbacksRequestDto } from './dto';
import { DealersControllersEnum, DealersFeedbackGetEndpoint, DealersFeedbackPostEndpoint } from '@mobility/apps-dto/dist/services/dealers';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WrapResponseInterceptor } from '@app/common/interceptors/common-response-wrapper.interceptor';

@UseInterceptors(WrapResponseInterceptor)
@ApiTags(DealersControllersEnum.CarAdd)
@Controller(DealersControllersEnum.CarAdd)
export class CarAddController {
    // constructor(private readonly service: FeedbackControllerService) { }

    // @ApiOperation({ summary: 'Отправка заявки' })
    // @Post(DealersFeedbackPostEndpoint.endPointPath)
    // saveFeedback(@Body() body: CreateFeedbackRequestDto): Promise<DealersFeedbackPostEndpoint.ResponseData> {
    //     return this.service.saveFeedback(body).then((result) => ({
    //         feedback: result,
    //     }));
    // }

    // @ApiOperation({ summary: 'Отправка отзыва' })
    // @Get(DealersFeedbackGetEndpoint.endPointPath)
    // getFeedbacks(@Query() query: GetFeedbacksRequestDto): Promise<DealersFeedbackGetEndpoint.ResponseData> {
    //     return this.service.getFeedbacks(query);
    // }
}
