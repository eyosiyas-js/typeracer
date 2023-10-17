const { createServer } = require("http");
const express = require("express");
const { execute, subscribe } = require("graphql");
const { ApolloServer, gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./utils/contextMiddleware.js");
const mongoose = require("mongoose");
const { verify } = require("jsonwebtoken");

(async () => {
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });

  const onConnect = (connectionParams, webSocket) => {
    const token = connectionParams.Authorization || "";
    const user = verify(token, "mykey"); // Replace 'your-secret-key' with your secret key

    return { user };

    throw new Error("Unauthorized");
  };

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect,
    },
    { server: httpServer, path: "/graphql" }
  );
  const PORT = 4000;
  const MONGODB = "mongodb://localhost:27017/typeracer";
  mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
    console.log("mongodb connected");
  });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
