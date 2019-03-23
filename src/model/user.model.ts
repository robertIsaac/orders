import mongoose from "mongoose";
import {User} from "../interfaces/user.interface";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    balance: {
        type: Number
    },
});

const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default UserModel;
