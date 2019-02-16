import mongoose from "mongoose";
import {OrderItem} from "../interfaces/order-item.interface";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
// TODO add unique index to userId, itemId, orderId
const OrderItemModel = mongoose.model<OrderItem & mongoose.Document>('OrderItem', orderItemSchema);

export default OrderItemModel;
