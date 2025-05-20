import { ProductionInterface } from "./ProductionInterface";

export interface ProuductionLogInterface {
    id: number;
    production: ProductionInterface;
    qty: number;
    unit: string;
    createdAt: Date;
    remark: string;
}