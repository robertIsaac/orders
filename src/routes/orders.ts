import express = require("express");
import OrderModel from "../model/order.model";
import {Order} from "../interfaces/order.interface";
import RestaurantModel from "../model/restaurant.model";
import {Restaurant} from "../interfaces/restaurant.interface";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    OrderModel.find().then(orders => {
        res.send(orders);
        next();
    })
});

router.post("/", (req, res, next) => {
    RestaurantModel.findOne({_id: req.body.restaurantId}).then((restaurant: Restaurant | null) => {
        if (!restaurant) {
            res.status(400).send(`no restaurant found with id ${req.body.restaurantId}`);
            return;
        }
        const total = restaurant.delivery * (restaurant.tax / 100 + 1);
        const order: Order = {
            userId: req.body.userId,
            restaurantId: req.body.restaurantId,
            status: 'new',
            subtotal: 0,
            delivery: restaurant.delivery,
            tax: restaurant.tax,
            total: total,
            time: new Date,
        };
        new OrderModel(order).save().then(newOrder => {
            res.json({id: newOrder._id});
            next();
        }).catch(error => {
            console.log(error);
            res.status(400).send('bad request');
            next();
        });
    });
});

export = router;
