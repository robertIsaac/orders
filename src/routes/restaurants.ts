import express = require("express");
import {Restaurant} from "../interfaces/restaurant.interface";
import RestaurantModel from "../model/restaurant.model";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    RestaurantModel.find().then(restaurants => {
        res.send(restaurants);
        next();
    })
});

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
    console.log(restaurant);
    new RestaurantModel(restaurant).save().then((newRestaurant: Restaurant) => {
        res.json({id: newRestaurant._id});
        next();
    }).catch(error => {
        console.log(error);
        res.status(400).send('bad request');
        next();
    });
});

export = router;
