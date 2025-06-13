import { BillSaleInterface } from "./BillSaleInterface";
import { ProductionInterface } from "./ProductionInterface";

export interface BillSaleDetailInterface {
    id: number;
    billSale: BillSaleInterface;
    production: ProductionInterface;
    quantity: number;
    price: number;
}