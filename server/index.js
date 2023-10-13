const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware =  require("./utils/contextMiddleware.js")
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/" },
});

const MONGODB = "mongodb://localhost:27017/typeracer";
mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log("mongodb connected");
});

server.listen().then((server) => {
  console.log(`🚀 Server ready at ${server.url}`);
  // consolae.log(`🚀 Subscriptions ready at ${server.subscriptionsUrl}`);
});
