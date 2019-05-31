import cookieParser = require("cookie-parser");
import express = require("express");
import logger = require("morgan");
import path = require("path");
import indexRouter from "./routes";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";
import restaurantsRouter from "./routes/restaurants";
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import mongoose from 'mongoose';
import { jwtMiddleware } from "./middlewares/jwt";
import { CORS } from "./utils/cors";
import { RestaurantAPI } from "./datasources/restaurant-api";
import { OrderAPI } from "./datasources/order-api";
import { UserAPI } from "./datasources/user-api";

const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// graphql
const userAPI = new UserAPI();
const server = new ApolloServer({
    context: async ({req}) => {
        // simple auth check on every request
        const auth = userAPI.auth(req);
        if (!auth) {
            return null;
        }
        return {user: {...auth}};
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        restaurantAPI: new RestaurantAPI(),
        orderAPI: new OrderAPI(),
        userAPI,
    })
});
server.applyMiddleware({app});

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
app.use(CORS);
mongoose.set('useCreateIndex', true);
let mongoCredentials = '';
if (MONGO_USER && MONGO_PASSWORD) {
    mongoCredentials = `${MONGO_USER}:${MONGO_PASSWORD}`;
}
mongoose.connect(`mongodb://${mongoCredentials}${MONGO_PATH}`, {useNewUrlParser: true});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/orders", jwtMiddleware, ordersRouter);
app.use("/restaurants", jwtMiddleware, restaurantsRouter);

export = app;
