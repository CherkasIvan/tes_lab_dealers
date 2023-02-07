import { PaginationRequestQueryDto } from '@app/common';
import { DealersFeedbackGetEndpoint } from '@mobility/apps-dto/dist/services/dealers';

export class GetFeedbacksRequestDto extends PaginationRequestQueryDto implements DealersFeedbackGetEndpoint.RequestQueryParams {
    [key: string]: string | number;
}
