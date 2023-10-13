const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

module.exports = (context) => {
  let token
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization
  }

  if (token) {
    jwt.verify(token, "mykey", (err, decodedToken) => {
      context.user = decodedToken
    })
  }

  context.pubsub = pubsub

  return context
}
