import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
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
