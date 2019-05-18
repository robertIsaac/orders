import OrderModel from "../model/order.model";
import { Order } from "../interfaces/order.interface";
import OrderItemModel from "../model/order-item.model";
import { RestaurantAPI } from "./restaurant-api";
import { UserAPI } from "./user-api";

export class OrderAPI {
    restaurantAPI: RestaurantAPI = new RestaurantAPI();
    userAPI: UserAPI = new UserAPI();

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
            const item = await this.restaurantAPI.getItem(orderItem.itemId);
            if (!item) {
                throw Error(`can't find item with id ${orderItem.itemId}`);
            }
            orderItem.item = item;
            const user = await this.userAPI.getUser(orderItem.userId);
            if (!user) {
                throw Error(`can't find user with id ${orderItem.userId}`);
            }
            orderItem.user = user;
            return orderItem;
        });
        return orderItems;
    }

    async orderReducer(order: Order) {
        if (!order._id) {
            return null;
        }
        order.items = await this.getOrderItems(order._id);
        const user = await this.userAPI.getUser(order.userId);
        if (!user) {
            throw Error(`can't find user with id ${order.userId}`);
        }
        order.user = user;
        order.restaurant = await this.restaurantAPI.getRestaurant(order.restaurantId);
        return order;
    }
}
