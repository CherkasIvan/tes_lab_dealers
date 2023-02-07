import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './feedback.repository';

@Module({
    providers: [FeedbackService, FeedbackRepository],
    exports: [FeedbackService],
})
export class FeedbackModule {}
