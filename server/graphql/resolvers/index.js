const usersResolver = require('./users.js')
const roomsResolver = require('./room.js')

module.exports = {
  Query: {
    ...usersResolver.Query,
    ...roomsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...roomsResolver.Mutation,
  },
  Subscription: {
    ...roomsResolver.Subscription,
  },
}
