export interface OrderItem {
    _id?: string;
    orderId: string;
    itemId: string;
    userId: string;
    price: number;
    quantity: number;
    item: any; // TODO set type
}
