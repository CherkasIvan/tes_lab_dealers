import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { FeedbackEntity } from './entity/feedback.entity';
import { Serializable } from '@app/common/interfaces/serializable';
import { FeedbackModel } from './models/feedback.model';

@Injectable()
export class FeedbackRepository {
    constructor(@Inject('Db') private readonly db: Db) {
        this.collection = db.collection<FeedbackEntity>('feedback');
    }

    private readonly collection;

    async saveFeedback(feedback: Serializable<FeedbackEntity>): Promise<FeedbackModel> {
        const inserted = await this.collection.insertOne(feedback.serialize()).then((result) => result.insertedId);
        return this.collection.findOne({ _id: inserted }).then((result) => new FeedbackModel({ ...feedback.serialize(), ...result }));
    }

    async getFeedbacks(page = 0, onPage = 10): Promise<FeedbackModel[]> {
        return this.collection
            .find({}, { sort: ['createdAt', -1] })
            .limit(onPage)
            .skip(page * onPage)
            .map((item) => new FeedbackModel(item))
            .toArray();
    }

    count(): Promise<number> {
        return this.collection.countDocuments();
    }
}
