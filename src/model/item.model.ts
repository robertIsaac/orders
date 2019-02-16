import mongoose from "mongoose";
import {Item} from "../interfaces/item.interface";

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    restaurantId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
});
// TODO add unique index to restaurantId, name
const ItemModel = mongoose.model<Item & mongoose.Document>('Item', itemSchema);

export default ItemModel;
