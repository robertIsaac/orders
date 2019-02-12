import cookieParser = require("cookie-parser");
import express = require("express");
import logger = require("morgan");
import path = require("path");
import indexRouter from "./routes";
import usersRouter from "./routes/users";
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import mongoose from 'mongoose';

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_PATH,
} = process.env;
validateEnv();
app.set('env', process.env);
mongoose.set('useCreateIndex', true);
let mongoCredentials = '';
if (MONGO_USER && MONGO_PASSWORD) {
    mongoCredentials = `${MONGO_USER}:${MONGO_PASSWORD}`;
}
mongoose.connect(`mongodb://${mongoCredentials}${MONGO_PATH}`, {useNewUrlParser: true});

app.use("/", indexRouter);
app.use("/users", usersRouter);

export = app;
