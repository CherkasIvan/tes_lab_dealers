import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackInterface } from './interfaces/feedback.interface';
import { Pagination } from '@app/common';
import { PaginationInterface } from '@mobility/apps-dto';
import { FeedbackModel } from './models/feedback.model';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(private readonly repository: FeedbackRepository) {}

    async saveFeedback(feedback: CreateFeedbackDto): Promise<FeedbackInterface> {
        const feedbackModel = new FeedbackModel({
            ...feedback,
            createdAt: new Date(),
            isSent: false,
        });
        return this.repository.saveFeedback(feedbackModel).then((result) => result.getFeedback());
    }

    async getFeedbacks(pagination: Pagination): Promise<PaginationInterface<FeedbackInterface>> {
        const { page, onPage } = pagination;
        const feedbacks = await this.repository.getFeedbacks(pagination.page, pagination.onPage);
        const count = await this.repository.count();
        return {
            onPage,
            page,
            rows: feedbacks.map((item) => item.getFeedback()),
            total: count,
        };
    }
}
