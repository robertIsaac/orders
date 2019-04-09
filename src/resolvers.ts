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
        // launch: (_, { id }, { dataSources }) =>
        //     dataSources.launchAPI.getLaunchById({ launchId: id }),
        // me: async (_, __, { dataSources }) =>
        //     dataSources.userAPI.findOrCreateUser(),
        // Mission: {
        //     // make sure the default size is 'large' in case user doesn't specify
        //     missionPatch: (mission, { size } = { size: 'LARGE' }) => {
        //         return size === 'SMALL'
        //             ? mission.missionPatchSmall
        //             : mission.missionPatchLarge;
        //     },
        // },
    },
};
