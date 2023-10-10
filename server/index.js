const { ApolloServer } = require("apollo-server");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: { path: "/" },
});

server.listen().then((server) => {
  console.log(`🚀 Server ready at ${server.url}`);
  console.log(`🚀 Subscriptions ready at ${server.subscriptionsUrl}`);
});
