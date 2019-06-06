import { authenticated } from "../utils/authenticated";

const {paginateResults} = require('../utils/paginate-results');
module.exports = {
    Query: {
        restaurants: authenticated(async (_, {pageSize = 20, after}, {dataSources}) => {
            const allRestaurants = await dataSources.restaurantAPI.getAllRestaurants();
            allRestaurants.reverse();
            const restaurants = paginateResults({
                after,
                pageSize,
                results: allRestaurants,
            });

            return {
                restaurants,
                cursor: restaurants.length ? restaurants[restaurants.length - 1].cursor : null,
                hasMore: restaurants.length
                    ? restaurants[restaurants.length - 1].cursor !==
                    allRestaurants[allRestaurants.length - 1].cursor
                    : false,
            };
        }),
        restaurant: authenticated(async (_, {id}, {dataSources}) => {
            return await dataSources.restaurantAPI.getRestaurant(id);
        }),
    },
    Mutation: {
        insertRestaurant: authenticated(async (_, {restaurantInput}, {dataSources}) => {
            return dataSources.restaurantAPI.insertRestaurant(restaurantInput);
        }),
        insertRestaurantItem: authenticated(async (_, {restaurantItemInput}, {dataSources}) => {
            return dataSources.restaurantAPI.insertRestaurantItem(restaurantItemInput);
        }),
    }
};
