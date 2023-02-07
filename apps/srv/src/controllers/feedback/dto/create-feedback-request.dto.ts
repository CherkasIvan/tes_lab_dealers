import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateFeedbackDto } from '../../../modules/feedback/dto/create-feedback.dto';
import { DealersFeedbackPostEndpoint } from '@mobility/apps-dto/dist/services/dealers';

export class CreateFeedbackRequestDto implements CreateFeedbackDto, DealersFeedbackPostEndpoint.RequestBody {
    @ApiProperty()
    @IsNotEmpty()
    appeal!: string;
    @ApiProperty()
    @IsNotEmpty()
    email!: string;
    @ApiProperty()
    @IsNotEmpty()
    user!: string;
}
