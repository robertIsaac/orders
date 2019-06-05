import OrderModel from "../model/order.model";
import { Order } from "../interfaces/order.interface";
import OrderItemModel from "../model/order-item.model";
import { RestaurantAPI } from "./restaurant-api";
import { UserAPI } from "./user-api";
import { OrderItem } from "../interfaces/order-item.interface";

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

    async insertOrder(orderInput, jwt): Promise<InsertResponse> {
        const restaurant = await this.restaurantAPI.getRestaurant(orderInput.restaurantId);
        if (!restaurant) {
            return {
                success: false,
                message: `can't find a restaurant with id ${orderInput.restaurantId}`
            };
        }
        const total = restaurant.delivery * (restaurant.tax / 100 + 1);
        const order: Order = {
            restaurantId: orderInput.restaurantId,
            userId: jwt.id,
            delivery: restaurant.delivery,
            tax: restaurant.tax,
            status: 'new',
            subtotal: 0,
            time: new Date,
            total
        };
        try {
            const newOrder = await new OrderModel(order).save();
            return {
                success: true,
                insertedId: newOrder._id
            };
        } catch (e) {
            return {
                success: false,
                message: e.name
            };
        }
    }

    async insertOrderItem(orderItemInput, jwt): Promise<InsertResponse> {
        const item = await this.restaurantAPI.getRestaurantItem(orderItemInput.restaurantItemId);
        if (!item) {
            return {
                success: false,
                message: `can't find a restaurant with id ${orderItemInput.restaurantItemId}`
            };
        }
        const order = await this.getOrder(orderItemInput.orderId);
        if (!order) {
            return {
                success: false,
                message: `can't find an order with id ${orderItemInput.orderId}`
            };
        }
        const orderItem: OrderItem = {
            itemId: item._id,
            price: item.price,
            userId: jwt.id,
            orderId: orderItemInput.orderId,
            quantity: orderItemInput.quantity,
        };
        try {
            const newOrderItem = await new OrderItemModel(orderItem).save();
            return {
                success: true,
                insertedId: newOrderItem._id
            };
        } catch (e) {
            return {
                success: false,
                message: e.name
            };
        }
    }
}
