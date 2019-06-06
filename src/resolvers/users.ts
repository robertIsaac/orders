import { authenticated } from "../utils/authenticated";

module.exports = {
    Query: {
        me: authenticated(async (_, __, {dataSources, jwt}) => {
            return dataSources.userAPI.getUser(jwt.id)
        }),
    },
    Mutation: {
        register: async (_, {username, password, jobTitle}, {dataSources}) => {
            return await dataSources.userAPI.register(username, password, jobTitle);
        }, login: async (_, {username, password}, {dataSources}) => {
            return await dataSources.userAPI.login(username, password);
        },
    }
};
