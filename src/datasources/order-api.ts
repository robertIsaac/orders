import OrderModel from "../model/order.model";
import { Order } from "../interfaces/order.interface";
import OrderItemModel from "../model/order-item.model";
import { RestaurantAPI } from "./restaurant-api";

export class OrderAPI {
    resturantApi: RestaurantAPI = new RestaurantAPI();

    async getAllOrders() {
        const orders = await OrderModel.find();
        return orders.map(order => this.orderReducer(order));
    }

    async getOrder(id: string) {
        const order = await OrderModel.findById(id);
        if (!order) {
            return null;
        }
        return await this.orderReducer(order);
    }

    async getOrderItems(orderId: string) {
        const orderItems = await OrderItemModel.find({orderId});
        orderItems.map(async orderItem => {
            orderItem.item = this.resturantApi.getItem(orderItem.itemId);
            return orderItem;
        });
        return orderItems;
    }

    async orderReducer(order: Order) {
        if (!order._id) {
            return null;
        }
        order.items = await this.getOrderItems(order._id);
        return order;
    }
}
