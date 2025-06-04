import { ProductionInterface } from "./ProductionInterface";
import { StoreInterface } from "./Storelnterface";

export interface TransferStoreInterface {
    id: number;
    fromStore: StoreInterface;
    toStore: StoreInterface;
    production: ProductionInterface;
    quantity: number;
    remark: string;
    createdAt: string;
}