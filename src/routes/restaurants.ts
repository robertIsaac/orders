import express = require("express");
import {Restaurant} from "../interfaces/restaurant.interface";
import RestaurantModel from "../model/restaurant.model";
import {Item} from "../interfaces/item.interface";
import ItemModel from "../model/item.model";

const router = express.Router();

/**
 * return all the stores
 * */
router.get("/", (req, res, next) => {
    RestaurantModel.find().then(restaurants => {
        res.send(restaurants);
        next();
    })
});

/**
 * create new restaurant
 * @param name {string} the unique name of the restaurant
 * @param phone {string}  the unique phone of the restaurant
 * @param delivery {number} the delivery fees of this restaurant
 * @param tax {number} the tax of this restaurant in percentage
 * @return {string} the id of the new created restaurant
 * */
router.post("/", (req, res, next) => {
    const restaurant: Restaurant = {
        name: req.body.name,
        phone: req.body.phone,
        delivery: req.body.delivery,
        tax: req.body.tax,
    };
    if (req.body.menu) {
        restaurant['menu'] = req.body.menu;
    }
    new RestaurantModel(restaurant).save().then((newRestaurant: Restaurant) => {
        res.json({id: newRestaurant._id});
        next();
    }).catch(error => {
        console.log(error);
        res.status(400).send('bad request');
        next();
    });
});

/**
 * return all the stores
 * */
router.get("/:restaurantId/items/", (req, res, next) => {
    // TODO if restaurant id doesn't exits return error instead of empty array
    ItemModel.find().then(items => {
        res.send(items);
        next();
    })
});

router.post("/:restaurantId/items/", (req, res, next) => {
    const item: Item = {
        name: req.body.name,
        price: req.body.price,
        restaurantId: req.params.restaurantId,
    };
    new ItemModel(item).save().then((newItem: Item) => {
        res.json({id: newItem._id});
        next();
    }).catch(error => {
        console.log(error);
        res.status(400).send('bad request');
        next();
    });
});

export = router;
