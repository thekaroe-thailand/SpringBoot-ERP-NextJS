import { ProductionInterface } from "./ProductionInterface";

export interface SaleTempInterface {
    id: number;
    production: ProductionInterface;
    price: number;
    userId: number;
    quantity: number;
}