import { UserInterface } from "./UserInterface";

export interface BillSaleInterface {
    id: number;
    User: UserInterface;
    inputMonty: number;
    discount: number;
    total: number;
    status: string;
    createdAt: Date;
}
