import express = require("express");
import { OrderItem } from "../interfaces/order-item.interface";
import { Order } from "../interfaces/order.interface";
import { Restaurant } from "../interfaces/restaurant.interface";
import ItemModel from "../model/item.model";
import OrderItemModel from "../model/order-item.model";
import OrderModel from "../model/order.model";
import RestaurantModel from "../model/restaurant.model";

const router = express.Router();

/**
 * get all orders
 */
router.get("/", (req, res, next) => {
    OrderModel.find().then((orders) => {
        res.send(orders);
        next();
    });
});

/**
 * add new order
 * @param restaurantId {string} the id of the restaurant to order from
 * @return {string} the id of the created order
 */
router.post("/", (req, res, next) => {
    RestaurantModel.findById(req.body.restaurantId).then((restaurant: Restaurant | null) => {
        if (!restaurant) {
            res.status(400).send(`no restaurant found with id ${req.body.restaurantId}`);
            return;
        }
        const total = restaurant.delivery * (restaurant.tax / 100 + 1);
        const order: Order = {
            delivery: restaurant.delivery,
            restaurantId: req.body.restaurantId,
            status: "new",
            subtotal: 0,
            tax: restaurant.tax,
            time: new Date(),
            tip: 0,
            total,
            userId: req.app.get("jwt").id,
        };
        new OrderModel(order).save().then((newOrder) => {
            res.status(201).json({id: newOrder._id});
            next();
        }).catch((error) => {
            console.error(error);
            res.status(400).send("bad request");
            next();
        });
    });
});

router.get("/:orderId", (req, res, next) => {
    OrderModel.findById(req.params.orderId).then((order) => {
        res.send(order);
        next();
    }).catch((error) => {
        console.error(error);
        res.status(404).send({status: 404, message: "not found"});
        next();
    });
});

router.patch("/:orderId", (req, res, next) => {
    const allowed = ["status", "tip"];
    const editOrder: Partial<Order> = req.body;
    for (const key in editOrder) {
        if (!allowed.includes(key)) {
            delete editOrder[key];
        }
    }
    OrderModel.updateOne({_id: req.params.orderId}, editOrder).then(() => {
        res.status(204).send(editOrder);
        next();
    }).catch((error) => {
        console.error(error);
        res.status(404).send({status: 404, message: "not found"});
        next();
    });
});

/**
 * get all order items
 */
router.get("/:orderId/items", (req, res, next) => {
    OrderItemModel.find().then((orderItems) => {
        res.send(orderItems);
        next();
    });
});

/**
 * add new item to an order
 * @param restaurantId {string} the id of the restaurant to order from
 * @param itemId {string} the id of the item to order
 * @return {string} the id of the created order item
 */
router.post("/:orderId/items", (req, res, next) => {
    ItemModel.findById(req.body.itemId).then((item) => {
        if (!item) {
            res.status(400).send(`no item found with id ${req.body.itemId}`);
            return;
        }
        const orderItem: OrderItem = {
            itemId: req.body.itemId,
            orderId: req.params.orderId,
            price: item.price,
            quantity: req.body.quantity,
            userId: req.app.get("jwt").id,
        };
        new OrderItemModel(orderItem).save().then((newOrderItem) => {
            res.status(201).json({id: newOrderItem._id});
            next();
        }).catch((error) => {
            console.error(error);
            res.status(400).send("bad request");
            next();
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).send({message: `can't find item with id ${req.body.itemId}`});
        next();
    });
});

export = router;
