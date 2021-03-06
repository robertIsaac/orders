const {gql} = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type Query {
        restaurants(
            pageSize: Int
            after: String
        ): RestaurantsConnection!
        restaurant(id: ID!): Restaurant
        orders(
            pageSize: Int
            after: String
        ): OrderConnection!
        order(id: ID!): Order
        # Queries for the current user
        me: User
    }

    type OrderConnection {
        cursor: String!
        hasMore: Boolean!
        orders: [Order]!
    }

    type RestaurantsConnection {
        cursor: String!
        hasMore: Boolean!
        restaurants: [Restaurant]!
    }

    type Order {
        id: ID!
        status: String!
        subtotal: Float!
        total: Float!
        delivery: Float!
        tax: Float!
        time: Date!
        tip: Float
        user: User!
        restaurant: Restaurant!
        items: [OrderItem]!
    }

    type User {
        id: ID!
        username: String!
        jobTitle: String
        balance: Float
    }

    type Restaurant {
        id(id: ID): ID!
        name: String!
        phone: String!
        menu: String
        delivery: Float!
        tax: Float!
        items: [Item]!
    }

    type Item {
        id: ID!
        name: String!
        price: Float!
    }

    type OrderItem {
        id: ID!
        price: Float!
        quantity: Int!
        item: Item!
        user: User!
    }

    type Mutation {
        login(username: String!, password: String!): String # login token
        register(username: String!, password: String!, jobTitle: String): String # login token
        insertRestaurant(restaurantInput: RestaurantInput): InsertResponse # restaurant id
        insertRestaurantItem(restaurantItemInput: RestaurantItemInput): InsertResponse # item id
        insertOrder(orderInput: OrderInput): InsertResponse # order id
        insertOrderItem(orderItemInput: OrderItemInput): InsertResponse # order item id
    }

    input RestaurantInput {
        name: String!
        phone: String!
        delivery: Float!
        tax: Float!
        menu: String
    }

    input RestaurantItemInput {
        restaurantId: ID!
        name: String!
        price: Float!
    }

    input OrderInput {
        restaurantId: ID!
    }

    input OrderItemInput {
        orderId: ID!
        restaurantItemId: ID!
        quantity: Int!
    }

    type InsertResponse {
        success: Boolean!
        insertedId: String
        message: String
    }
`;
module.exports = typeDefs;
