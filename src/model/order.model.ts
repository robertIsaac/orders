import mongoose from "mongoose";
import {Order} from "../interfaces/order.interface";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    delivery: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
});

const OrderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);

export default OrderModel;
