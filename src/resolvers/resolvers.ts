const orders = require('./orders');
const restaurants = require('./restaurants');
const users = require('./users');
module.exports = {
    ...orders,
    ...restaurants,
    ...users,
    Query: {
        ...orders.Query,
        ...restaurants.Query,
        ...users.Query,
    },
    Mutation: {
        ...orders.Mutation,
        ...restaurants.Mutation,
        ...users.Mutation,
    }
};
