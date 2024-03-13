const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const gql = require('graphql-tag')
const express = require('express')
const http = require('http')
const { PubSub } = require('graphql-subscriptions')
const { verify } = require('jsonwebtoken')

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const mongoose = require('mongoose')
;(async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  const httpServer = http.createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const pubsub = new PubSub()

  // Same ApolloServer initialization as before, plus the drain plugin.
  const contextMiddleware = ({ req, connection }) => {
    const context = {}

    if (req) {
      const token = req.headers.authorization
      if (token) {
        const user = verify(token, 'mykey')
        context.user = user
      }
    }

    context.pubsub = pubsub 
    return context
  }

  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
    
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,

      async onConnect(connectionParams, webSocket, context) {
        console.log('Connected!')
        const token = connectionParams.Authorization || ''
        const user = verify(token, 'mykey') 
        return {
          pubsub,
          user,
        }
      },
      onDisconnect(webSocket, context) {
        console.log('Disconnected!')
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    },
  )

  await server.start()
  server.applyMiddleware({
    app,
  })
  const MONGODB = 'mongodb://localhost:27017/typeracer'
  mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
    console.log('mongodb connected')
  })

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))

  

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)

})(typeDefs, resolvers)
