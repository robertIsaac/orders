import { authenticated } from "../utils/authenticated";

const {paginateResults} = require('../utils/paginate-results');

module.exports = {
    Query: {
        orders: authenticated(async (_, {pageSize = 20, after}, {dataSources}) => {
            const allOrders = await dataSources.orderAPI.getAllOrders();
            allOrders.reverse();
            const orders = paginateResults({
                after,
                pageSize,
                results: allOrders,
            });
            return {
                orders,
                cursor: orders.length ? orders[orders.length - 1].cursor : null,
                hasMore: orders.length
                    ? orders[orders.length - 1].cursor !==
                    allOrders[allOrders.length - 1].cursor
                    : false,
            };
        }),
        order: authenticated(async (_, {id}, {dataSources}) => {
            return await dataSources.orderAPI.getOrder(id);
        }),
    },
    Mutation: {
        insertOrder: authenticated(async (_, {orderInput}, {dataSources, jwt}) => {
            return dataSources.orderAPI.insertOrder(orderInput, jwt);
        }),
        insertOrderItem: authenticated(async (_, {orderItemInput}, {dataSources, jwt}) => {
            return dataSources.orderAPI.insertOrderItem(orderItemInput, jwt);
        }),
        updateOrder: authenticated(async (_, {updateOrderInput}, {dataSources}) => {
            return dataSources.orderAPI.updateOrder(updateOrderInput);
        }),
    }
};
