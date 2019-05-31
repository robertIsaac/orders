import RestaurantModel from "../model/restaurant.model";
import ItemModel from "../model/item.model";
import { Restaurant } from "../interfaces/restaurant.interface";
import { Item } from "../interfaces/item.interface";

export class RestaurantAPI {
    async getAllRestaurants() {
        const restaurants = await RestaurantModel.find();
        return restaurants.map(restaurant => this.restaurantReducer(restaurant));
    }

    async getRestaurant(id: string) {
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return null;
        }
        return await this.restaurantReducer(restaurant);
    }

    async getRestaurantItems(restaurantId: string) {
        return await ItemModel.find({restaurantId: restaurantId});
    }

    async restaurantReducer(restaurant: Restaurant) {
        if (!restaurant._id) {
            return null;
        }
        restaurant.items = await this.getRestaurantItems(restaurant._id);
        return restaurant;
    }

    async getItem(itemId: string) {
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return null;
        }
        return item;
    }

    async insertRestaurant(restaurantInput) {
        const restaurant: Restaurant = {
            name: restaurantInput.name,
            phone: restaurantInput.phone,
            delivery: restaurantInput.delivery,
            tax: restaurantInput.tax,
        };
        if (restaurantInput.menu) {
            restaurant['menu'] = restaurantInput.menu;
        }
        const newRestaurant = await new RestaurantModel(restaurant).save();
        return newRestaurant._id;
    }

    async insertRestaurantItem(restaurantInput) {
        const restaurant = await this.getRestaurant(restaurantInput.restaurantId);
        if (!restaurant) {
            return null;
        }
        const item: Item = {
            restaurantId: restaurantInput.restaurantId,
            name: restaurantInput.name,
            price: restaurantInput.price,
        };
        const newItem = await new ItemModel(item).save();
        return newItem._id;
    }

    async getRestaurantItem(restaurantItemId: string) {
        return await ItemModel.findById(restaurantItemId);
    }
}
