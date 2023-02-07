export class DealerModel {
    id?: string;
    name!: string;
    sapCode!: string;
    totalSales!: number;

    constructor(model: DealerModel) {
        this.name = model.name;
        this.sapCode = model.sapCode;
        this.totalSales = model.totalSales;
    }
}
