import { OrderItem } from "./order-item.interface";
import { User } from "./user.interface";

export interface Order {
    _id?: string;
    userId: string;
    restaurantId: string;
    status: string;
    subtotal: number;
    total: number;
    delivery: number;
    tax: number;
    time: Date;
    tip?: number;
    items?: OrderItem[];
    user: User;
    restaurant: any;
}
