import { Injectable } from '@nestjs/common';
import { FeedbackService } from '../../modules/feedback/feedback.service';
import { FeedbackInterface } from '../../modules/feedback/interfaces/feedback.interface';
import { PaginationInterface, PaginationRequest } from '@mobility/apps-dto';
import { CreateFeedbackDto } from '../../modules/feedback/dto/create-feedback.dto';

@Injectable()
export class FeedbackControllerService {
    constructor(private readonly feedbackService: FeedbackService) {}

    saveFeedback(feedback: CreateFeedbackDto): Promise<FeedbackInterface> {
        return this.feedbackService.saveFeedback(feedback);
    }

    getFeedbacks(pagination: PaginationRequest): Promise<PaginationInterface<FeedbackInterface>> {
        return this.feedbackService.getFeedbacks(pagination);
    }
}
