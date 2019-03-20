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
itemSchema.index({restaurantId: 1, name: 1}, {unique: true});
const ItemModel = mongoose.model<Item & mongoose.Document>('Item', itemSchema);

export default ItemModel;
