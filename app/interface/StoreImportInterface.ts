import { ProductionInterface } from "./ProductionInterface";
import { StoreInterface } from "./Storelnterface";

export interface StoreImportInterface {
    id: number;
    store: StoreInterface;
    production: ProductionInterface;
    qty: number;
    remark: string;
    importDate: string;
}