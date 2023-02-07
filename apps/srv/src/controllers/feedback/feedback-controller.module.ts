import { Module } from '@nestjs/common';
import { FeedbackModule } from '../../modules/feedback/feedback.module';
import { FeedbackControllerService } from './feedback-controller.service';
import { FeedbackController } from './feedback.controller';

@Module({
    imports: [FeedbackModule],
    providers: [FeedbackControllerService],
    controllers: [FeedbackController],
})
export class FeedbackControllerModule {}
