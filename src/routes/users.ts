import express = require("express");
import UserModel from "../model/user.model";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {User} from "../interfaces/user.interface";
import {jwtMiddleware} from "../middlewares/jwt";

const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

function getJWTToken(user: User, req: Request) {
    const env = req.app.get('env');
    const {JWT_SECRET, JWT_EXP} = env;
    return jwt.sign({
        id: user._id,
        username: user.username,
    }, JWT_SECRET, {expiresIn: JWT_EXP});
}

/* GET users listing. */
router.get("/", jwtMiddleware, (req, res, next) => {
    UserModel.find().then(users => {
        res.send(users);
        next();
    })
});

/* GET user. */
router.get("/:userId", jwtMiddleware, (req, res, next) => {
    UserModel.findById(req.params.userId).then(user => {
        res.send(user);
        next();
    })
});

function wrongCredentials(res: Response, next: NextFunction) {
    res.status(400).send({message: 'username or password is wrong'});
    next();
}

router.post("/login", (req, res, next) => {
    UserModel.findOne({username: req.body.username}).select('+password').then((user) => {
        if (!user) {
            wrongCredentials(res, next);
            return;
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            wrongCredentials(res, next);
            return;
        }
        const token = getJWTToken(user, req);
        res.send({token: token});
    }).catch((error) => {
        console.error(error);
        wrongCredentials(res, next);
    });
});

router.post("/register", (req, res, next) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, +req.app.get('env').SALT_ROUNDS);
    const user: User = {
        username: req.body.username,
        jobTitle: req.body.jobTitle,
        password: hashedPassword,
    };
    const newUser = new UserModel(user);
    newUser.save().then(newUser => {
        const token = getJWTToken(newUser, req);
        res.status(201).json({token: token});
        next();
    }).catch(error => {
        console.error(error);
        res.status(400).send('username already exits');
        next();
    });
});

router.delete("/all", (req, res, next) => {
    UserModel.remove({}, () => {
        res.send('removed all');
        next();
    });
});

export = router;
