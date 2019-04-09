// import {Restaurant} from "../interfaces/restaurant.interface";
import RestaurantModel from "../model/restaurant.model";
import ItemModel from "../model/item.model";
import {Restaurant} from "../interfaces/restaurant.interface";
// import {Item} from "../interfaces/item.interface";
// import ItemModel from "../model/item.model";
// import express = require("express");

// const router = express.Router();

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
}

/**
 * return all the restaurants
 * */

// router.get("/", (req, res, next) => {
//     RestaurantModel.find().then(restaurants => {
//         res.send(restaurants);
//         next();
//     })
// });

/**
 * create new restaurant
 * @param name {string} the unique name of the restaurant
 * @param phone {string}  the unique phone of the restaurant
 * @param delivery {number} the delivery fees of this restaurant
 * @param tax {number} the tax of this restaurant in percentage
 * @return {string} the id of the new created restaurant
 * */
// router.post("/", (req, res, next) => {
//     const restaurant: Restaurant = {
//         name: req.body.name,
//         phone: req.body.phone,
//         delivery: req.body.delivery,
//         tax: req.body.tax,
//     };
//     if (req.body.menu) {
//         restaurant['menu'] = req.body.menu;
//     }
//     new RestaurantModel(restaurant).save().then((newRestaurant: Restaurant) => {
//         res.status(201).json({id: newRestaurant._id});
//         next();
//     }).catch(error => {
//         console.error(error);
//         res.status(400).send('bad request');
//         next();
//     });
// });

/**
 * return all the restaurant's items
 * */
// router.get("/:restaurantId/items/", (req, res, next) => {
//     const {restaurantId} = req.params;
//     RestaurantModel.findById(restaurantId).then(restaurant => {
//         if (!restaurant) {
//             res.status(400).send({message: `no restaurant found with id ${restaurantId}`});
//             next();
//             return;
//         }
//         ItemModel.find({restaurantId: restaurantId}).then(items => {
//             res.send(items);
//             next();
//         }).catch(error => {
//             console.error(error);
//             res.status(500).send({message: `internal server error`});
//             next();
//         });
//     }).catch(error => {
//         console.error(error);
//         res.status(400).send({message: `no restaurant found with id ${restaurantId}`});
//         next();
//         return;
//     });
// });

// router.post("/:restaurantId/items/", (req, res, next) => {
//     const item: Item = {
//         name: req.body.name,
//         price: req.body.price,
//         restaurantId: req.params.restaurantId,
//     };
//     new ItemModel(item).save().then((newItem: Item) => {
//         res.status(201).json({id: newItem._id});
//         next();
//     }).catch(error => {
//         console.error(error);
//         res.status(400).send('bad request');
//         next();
//     });
// });

// export = router;
