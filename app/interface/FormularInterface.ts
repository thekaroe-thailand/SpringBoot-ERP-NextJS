import { MaterialInterface } from "./Materialinterface";
import { ProductionInterface } from "./ProductionInterface";

export interface FormularInterface {
    id: number;
    name: string;
    material: MaterialInterface;
    qty: number;
    unit: string;
    production: ProductionInterface
}