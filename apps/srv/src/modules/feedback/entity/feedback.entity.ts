import { ObjectId } from 'mongodb';

export interface FeedbackEntity {
    _id?: string | ObjectId;
    user: string;
    email: string;
    appeal: string;
    createdAt: Date;
    isSent: boolean;
}
