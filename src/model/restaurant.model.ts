import mongoose from "mongoose";
import {Restaurant} from "../interfaces/restaurant.interface";

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    menu: {
        type: String,
        unique: true,
        sparse: true,
    },
    delivery: {
        type: Number,
        required: true,
    },
    tax: {
        type: String,
        required: true,
    },
});

const RestaurantModel = mongoose.model<Restaurant & mongoose.Document>('Restaurant', restaurantSchema);

export default RestaurantModel;
