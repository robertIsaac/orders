import cookieParser = require("cookie-parser");
import express = require("express");
import logger = require("morgan");
import path = require("path");
import indexRouter from "./routes";
import usersRouter from "./routes/users";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

export = app;
