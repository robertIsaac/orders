import express = require("express");
import UserModel from "../model/user.model";
import {NextFunction, Request, Response} from "express-serve-static-core";

const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

function getJWTToken(user: User, req: Request) {
    const env = req.app.get('env');
    const {JWT_SECRET} = env;
    return jwt.sign({
        id: user._id,
        name: user.name,
    }, JWT_SECRET, {expiresIn: '7d'});
}

/* GET users listing. */
router.get("/", (req, res, next) => {
    const env = req.app.get('env');
    const {JWT_SECRET} = env;
    let token;
    if (req.headers.authorization && typeof req.headers.authorization === 'string') {
        token = req.headers.authorization.replace('Bearer ', '');
    } else {
        res.status(403).send('invalid token');
        return;
    }
    let jwtBody;
    try {
        jwtBody = jwt.verify(token, JWT_SECRET, {expiresIn: '7d'});
    } catch (e) {
        console.log(e);
        res.status(403).send('invalid token');
        return;
    }
    UserModel.findOne({_id: jwtBody.id}).then(user => {
        if (!user) {
            res.status(403).send('invalid token');
            return;
        }
        UserModel.find().then(posts => {
            res.send(posts);
            next();
        })
    });
});

function wrongCredentials(res: Response, next: NextFunction) {
    res.status(400).send({message: 'username or password is wrong'});
    next();
}

router.post("/login", (req, res, next) => {
    UserModel.findOne({name: req.body.name}).select('+password').then((user) => {
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
        console.log(error);
        wrongCredentials(res, next);
    });
});

router.post("/register", (req, res, next) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, +req.app.get('env').SALT_ROUNDS);
    const user: User = {
        name: req.body.name,
        password: hashedPassword,
    };
    const newUser = new UserModel(user);
    newUser.save().then(newUser => {
        const token = getJWTToken(newUser, req);
        res.json({token: token});
        next();
    }).catch(error => {
        console.log(error);
        res.status(400).send('bad request');
        next();
    });
});

router.delete("/all", (req, res, next) => {
    UserModel.remove({}, () => {
        res.send('removed all');
        next();
    });
});

router.get("/logout", (req, res) => {
    res.send('TO DO');
});

export = router;