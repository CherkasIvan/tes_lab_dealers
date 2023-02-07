import { FeedbackInterface } from '../../../modules/feedback/interfaces/feedback.interface';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackApiModelDto implements FeedbackInterface {
    @ApiProperty()
    appeal!: string;
    @ApiProperty()
    createdAt!: Date;
    @ApiProperty()
    email!: string;
    @ApiProperty()
    isSent!: boolean;
    @ApiProperty()
    user!: string;
}
