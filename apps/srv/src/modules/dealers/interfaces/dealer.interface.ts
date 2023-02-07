import { DealerOffice } from './dealer-office.interface';

export interface Dealer {
    name: string;
    sapCode: string;
    totalSales: number;
    offices: DealerOffice[];
}
