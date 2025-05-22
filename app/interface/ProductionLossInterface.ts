import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLossInterface {
    id: number
    production: ProductionInterface
    qty: number
    unit: string
    createdAt: Date
    remark: string
}