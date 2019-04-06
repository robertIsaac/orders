const {gql} = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type Query {
        restaurants(
            pageSize: Int
            after: String
        ): RestaurantsConnection!
        #        order(id: ID!): Order
        #        orders(
        #            pageSize: Int
        #            after: String
        #        ): OrderConnection!
        #        order(id: ID!): Order
        # Queries for the current user
        #        me: User
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
        user: User
        restaurant: Restaurant
        status: String!
        subtotal: Float!
        total: Float!
        delivery: Float!
        tax: Float!
        time: Date!
        tip: Float
    }

    type User {
        id: ID!
        username: String!
        jobTitle: String
        balance: Float
    }

    type Restaurant {
        name: String!
        phone: String!
        menu: String
        delivery: Float
        tax: Float
    }

    type Mutation {
        # if false, booking trips failed -- check errors
        bookTrips(launchIds: [ID]!): TripUpdateResponse!

        # if false, cancellation failed -- check errors
        cancelTrip(launchId: ID!): TripUpdateResponse!

        login(username: String): String # login token
    }

    type TripUpdateResponse {
        success: Boolean!
        message: String
    }
`;
module.exports = typeDefs;
