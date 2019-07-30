import UserModel from "../model/user.model";
import * as crypto from "crypto";
import { User } from "../interfaces/user.interface";
import validateEnv from "../utils/validateEnv";
import { AuthResponse } from "../interfaces/auth-response";

const jwt = require('jsonwebtoken');

export class UserAPI {
    private env = validateEnv();

    protected static verifyHash(password, original) {
        const originalHash = original.split('$')[1];
        const salt = original.split('$')[0];
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return hash === originalHash;
    }

    protected static hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return [salt, hash].join('$');
    }

    async getUser(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }
        return user;
    }

    async login(username, password): Promise<AuthResponse> {
        const user = await UserModel.findOne({username}).select('+password');
        if (!user) {
            return {
                success: false,
                message: `username or password is not valid`
            };
        }
        if (!UserAPI.verifyHash(password, user.password)) {
            return {
                success: false,
                message: `username or password is not valid`
            };
        }
        return {
            success: true,
            token: this.getJWTToken(user)
        };
    }

    protected getJWTToken(user: User) {
        const {JWT_SECRET, JWT_EXP} = this.env;
        return jwt.sign({
            id: user._id,
            username: user.username,
        }, JWT_SECRET, {expiresIn: JWT_EXP});
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
        const user = await UserModel.findById(jwtBody.id);
        if (!user) {
            return null;
        }
        return jwtBody;
    }

    async register(username, password, jobTitle) {
        const currentUser = await UserModel.findOne({username});
        if (currentUser) {
            return {
                success: false,
                message: `username ${username} already exits`
            }
        }
        const hashedPassword = UserAPI.hashPassword(password);
        const user: User = {
            username,
            jobTitle,
            password: hashedPassword,
        };
        const newUser = new UserModel(user);
        const createdUser = await newUser.save();
        return {
            success: true,
            token: this.getJWTToken(createdUser)
        };
    }
}
