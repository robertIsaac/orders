import cookieParser = require("cookie-parser");
import express = require("express");
import logger = require("morgan");
import path = require("path");
import 'dotenv/config';
import mongoose from 'mongoose';
import { OrderAPI } from "./datasources/order-api";
import { RestaurantAPI } from "./datasources/restaurant-api";
import { UserAPI } from "./datasources/user-api";
import { jwtMiddleware } from "./middlewares/jwt";
import indexRouter from "./routes";
import ordersRouter from "./routes/orders";
import restaurantsRouter from "./routes/restaurants";
import usersRouter from "./routes/users";
import { CORS } from "./utils/cors";
import validateEnv from './utils/validateEnv';

const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers/resolvers');
var cors = require('cors');

const app = express();
// graphql
const userAPI = new UserAPI();
const server = new ApolloServer({
    context: async ({req}) => {
        const jwt = await userAPI.auth(req);
        if (!jwt) {
            return null;
        }
        return {jwt};
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        restaurantAPI: new RestaurantAPI(),
        orderAPI: new OrderAPI(),
        userAPI,
    }),
    introspection: true,
    playground: true,
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
app.set('env', validateEnv());
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
app.use(cors);
export = app;
