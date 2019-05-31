import UserModel from "../model/user.model";
import * as crypto from "crypto";
import { User } from "../interfaces/user.interface";

const jwt = require('jsonwebtoken');

export class UserAPI {
    private env = process.env;

    protected static verifyHash(password, original) {
        const originalHash = original.split('$')[1];
        const salt = original.split('$')[0];
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return hash === originalHash;
    }

    async auth(req) {
        const {JWT_SECRET, JWT_EXP} = this.env;
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        } else {
            return null;
        }
        let jwtBody;
        try {
            jwtBody = jwt.verify(token, JWT_SECRET, {expiresIn: JWT_EXP});
        } catch (e) {
            console.error(e);
            return null;
        }
        const user = UserModel.findById(jwtBody.id);
        if (!user) {
            return null;
        }
        return jwtBody;
    }

    async getUser(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }
        return user;
    }

    async login(username, password) {
        const user = await UserModel.findOne({username}).select('+password');
        if (!user) {
            return null;
        }
        if (!UserAPI.verifyHash(password, user.password)) {
            return null;
        }
        return this.getJWTToken(user);
    }

    protected getJWTToken(user: User) {
        const {JWT_SECRET, JWT_EXP} = this.env;
        return jwt.sign({
            id: user._id,
            username: user.username,
        }, JWT_SECRET, {expiresIn: JWT_EXP});
    }
}
