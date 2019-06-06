import { Item } from "./item.interface";
import { User } from "./user.interface";

export interface OrderItem {
    _id?: string;
    orderId: string;
    itemId: string;
    userId: string;
    price: number;
    quantity: number;
    item?: Item
    user?: User
}
