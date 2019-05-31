const {paginateResults} = require('./utils/paginate-results');

module.exports = {
    Query: {
        restaurants: async (_, {pageSize = 20, after}, {dataSources}) => {
            const allRestaurants = await dataSources.restaurantAPI.getAllRestaurants();
            // we want these in reverse chronological order
            allRestaurants.reverse();

            const restaurants = paginateResults({
                after,
                pageSize,
                results: allRestaurants,
            });

            return {
                restaurants,
                cursor: restaurants.length ? restaurants[restaurants.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: restaurants.length
                    ? restaurants[restaurants.length - 1].cursor !==
                    allRestaurants[allRestaurants.length - 1].cursor
                    : false,
            };
        },
        restaurant: async (_, {id}, {dataSources}) => {
            return await dataSources.restaurantAPI.getRestaurant(id);
        },
        orders: async (_, {pageSize = 20, after}, {dataSources}) => {
            const allOrders = await dataSources.orderAPI.getAllOrders();
            // we want these in reverse chronological order
            allOrders.reverse();

            const orders = paginateResults({
                after,
                pageSize,
                results: allOrders,
            });

            return {
                orders,
                cursor: orders.length ? orders[orders.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: orders.length
                    ? orders[orders.length - 1].cursor !==
                    allOrders[allOrders.length - 1].cursor
                    : false,
            };
        },
        order: async (_, {id}, {dataSources}) => {
            return await dataSources.orderAPI.getOrder(id);
        },
        // me: async (_, __, { dataSources }) =>
        //     dataSources.userAPI.findOrCreateUser(),
    },
    Mutation: {
        login: async (_, {username, password}, {dataSources}) => {
            return await dataSources.userAPI.login(username, password);
        },
        insertRestaurant: async (_, {restaurantInput}, {dataSources}) => {
            return dataSources.restaurantAPI.insertRestaurant(restaurantInput);
        },
        insertRestaurantItem: async (_, {restaurantItemInput}, {dataSources}) => {
            return dataSources.restaurantAPI.insertRestaurantItem(restaurantItemInput);
        },
        insertOrder: async (_, {orderInput}, {dataSources}) => {
            return dataSources.orderAPI.insertOrder(orderInput);
        },
        insertOrderItem: async (_, {orderItemInput}, {dataSources}) => {
            return dataSources.orderAPI.insertOrderItem(orderItemInput);
        }
    },
};
