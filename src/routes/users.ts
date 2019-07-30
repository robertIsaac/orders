import * as crypto from "crypto";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { sign } from "jsonwebtoken";
import { User } from "../interfaces/user.interface";
import { jwtMiddleware } from "../middlewares/jwt";
import UserModel from "../model/user.model";
import express = require("express");

const router = express.Router();

function getJWTToken(user: User, req: Request) {
    const env = req.app.get("env");
    const {JWT_SECRET, JWT_EXP} = env;
    return sign({
        id: user._id,
        username: user.username,
    }, JWT_SECRET, {expiresIn: JWT_EXP});
}

/* GET users listing. */
router.get("/", jwtMiddleware, (req, res, next) => {
    UserModel.find().then((users) => {
        res.send(users);
        next();
    });
});

/* GET user. */
router.get("/:userId", jwtMiddleware, (req, res, next) => {
    UserModel.findById(req.params.userId).then((user) => {
        res.send(user);
        next();
    });
});

function wrongCredentials(res: Response, next: NextFunction) {
    res.status(400).send({message: "username or password is wrong"});
    next();
}

router.post("/login", (req, res, next) => {
    UserModel.findOne({username: req.body.username}).select("+password").then((user) => {
        if (!user) {
            wrongCredentials(res, next);
            return;
        }
        if (!verifyHash(req.body.password, user.password)) {
            wrongCredentials(res, next);
            return;
        }
        const token = getJWTToken(user, req);
        res.send({token});
    }).catch((error) => {
        console.error(error);
        wrongCredentials(res, next);
    });
});

router.post("/register", (req, res, next) => {
    const hashedPassword = hashPassword(req.body.password);
    const user: User = {
        jobTitle: req.body.jobTitle,
        password: hashedPassword,
        username: req.body.username,
    };
    const newUser = new UserModel(user);
    newUser.save().then((savedNewUser) => {
        const token = getJWTToken(savedNewUser, req);
        res.status(201).json({token});
        next();
    }).catch((error) => {
        console.error(error);
        res.status(400).send("username already exits");
        next();
    });
});

router.delete("/all", (req, res, next) => {
    UserModel.remove({}, () => {
        res.send("removed all");
        next();
    });
});

// Create password hash using Password based key derivative function 2
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex");
    return [salt, hash].join("$");
}

// Checking the password hash
function verifyHash(password, original) {
    const originalHash = original.split("$")[1];
    const salt = original.split("$")[0];
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex");
    return hash === originalHash;
}

export = router;
