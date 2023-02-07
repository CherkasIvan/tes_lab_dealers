import { Document, Filter } from 'mongodb';
import { DealerModel } from '../../models';

export const DEALER_PIPELINE_QUERY = (filter: Filter<DealerModel>): Document[] => {
    return [
        { $match: filter },
        {
            $lookup: {
                from: 'dealers.offices',
                localField: 'sapCode',
                foreignField: 'parentSapCode',
                as: 'offices',
            },
        },
    ];
};
