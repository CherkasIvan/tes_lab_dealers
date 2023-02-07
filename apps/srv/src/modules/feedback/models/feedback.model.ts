import { FeedbackInterface } from '../interfaces/feedback.interface';
import { Serializable } from '@app/common/interfaces/serializable';
import { FeedbackEntity } from '../entity/feedback.entity';

export class FeedbackModel implements FeedbackInterface, Serializable<FeedbackEntity> {
    constructor(private readonly entity: FeedbackEntity) {}

    serialize(): FeedbackEntity {
        return this.entity;
    }

    get appeal(): string {
        return this.entity.appeal;
    }
    get createdAt(): Date {
        return this.entity.createdAt;
    }
    get email(): string {
        return this.entity.email;
    }
    get isSent(): boolean {
        return this.entity.isSent;
    }
    get user(): string {
        return this.entity.user;
    }

    getFeedback(): FeedbackInterface {
        return {
            appeal: this.appeal,
            createdAt: this.createdAt,
            email: this.email,
            isSent: this.isSent,
            user: this.user,
        };
    }
}
