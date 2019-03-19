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
}
