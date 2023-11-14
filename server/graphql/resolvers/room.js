const { AuthenticationError, UserInputError } = require('apollo-server')
const Room = require('../../models/Room.js')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

// const { PubSub } = require("graphql-subscriptions");

// const pubsub = new PubSub();

module.exports = {
  Query: {
    async startRoom(_, args, { pubsub, user }) {
      try {
        if (!user) throw new AuthenticationError('Not authorized')

        const room = await Room.findOneAndUpdate(
          { owner: user.ID },
          { $set: { status: true } },
          { new: true },
        )

        if (!room) {
          throw new UserInputError('Room not found or not owned by the user')
        }

        const rawData = fs.readFileSync('paragraph.json')
        const paragraphs = JSON.parse(rawData)

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * paragraphs.length)

        const NEWParagraph = {
          Paragraph: paragraphs[randomIndex].paragraph,
        }

        console.log(NEWParagraph)

        pubsub.publish(`Paragraph_${room.ID}`, { NEWParagraph })

        return room
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
  Mutation: {
    async createRoom(_, { name, password }, { user }) {
      if (!user) throw new AuthenticationError('Not authorized')
      let Errors = {}
      if (name.trim() === '') Errors.name = 'name must not be empty'
      if (password.trim() === '') Errors.password = 'password must not be empty'
      if (Object.keys(Errors).length > 0) throw Errors

      const HashedPassword = await bcrypt.hash(password, 6)

      const newRoom = await Room.create({
        name: name,
        password: HashedPassword,
        ID: uuidv4(),
        status: false,
        owner: user.ID,
        members: [{ ID: user.ID }],
      })
      return newRoom
    },
    async joinRoom(_, { name, password }, { user }) {
      if (!user) throw new AuthenticationError('Not authorized')
      let Errors = {}
      if (name.trim() === '') Errors.name = 'name must not be empty'
      if (password.trim() === '') Errors.password = 'password must not be empty'
      if (Object.keys(Errors).length > 0) throw Errors

      const room = await Room.findOne({ name: name })
      if (!room) throw new UserInputError('Room not found')

      if (room.members.length >= 8)
        throw new UserInputError('The room is currently full')

      const match = await bcrypt.compare(password, room.password)

      if (!match) throw new UserInputError('Incorrect Credentials')

      let found = false

      room.members.map((data) => {
        if (data.ID === user.ID) {
          console.log(true)
          found = true
        }
      })

      if (!found) {
        const joinedRoom = await Room.findOneAndUpdate(
          { name: name },
          { $push: { members: { ID: user.ID } } },
          { new: true },
        )
        return joinedRoom
      }
      // console.log(joinedRoom)
      return room
    },

    detachRoom: async (_, { roomId }, { user }) => {
      if (!user) throw new AuthenticationError('Not authorized')
      // const room = await Room.findOne({ ID: roomId });

      await Room.updateOne(
        { ID: roomId },
        { $pull: { members: { ID: user.ID } } },
      )
      return 'Successfully detached'
    },

    sendRank: async (_, { rankInfo }, { pubsub, user }) => {
      if (!user) throw new AuthenticationError('Not authorized')

      const room = await Room.findOne({ ID: rankInfo.roomId })

      if (!room) return new UserInputError('Room not found')

      room.members.map((data) => {
        if (data.ID !== user.ID) {
          return new UserInputError('Action not allowed')
        }
      })

      const newRank = {
        rank: rankInfo.rank,
        ID: user.ID,
        roomId: rankInfo.roomId,
      }
      pubsub.publish(`NEW_RANK_${rankInfo.roomId}`, { newRank })
      console.log(rankInfo)

      return newRank
    },
  },
  Subscription: {
    newRank: {
      subscribe: async (_, { roomId }, { pubsub, user }) => {
        if (!user) throw new AuthenticationError('Unauthenticated')

        try {
          const room = await Room.findOne({ ID: roomId })

          if (!room) {
            throw new UserInputError('Room not found')
          }

          const isMember = room.members.some((data) => data.ID === user.ID)

          if (!isMember) {
            throw new UserInputError('Action not allowed')
          }

          return pubsub.asyncIterator(`NEW_RANK_${roomId}`)
        } catch (error) {
          throw new Error('An error occurred: ' + error.message)
        }
      },
    },
    newParagraph: {
      subscribe: async (_, { roomId }, { pubsub, user }) => {
        if (!user) throw new AuthenticationError('Unauthenticated')

        try {
          const room = await Room.findOne({ ID: roomId })

          if (!room) {
            throw new UserInputError('Room not found')
          }
          const isMember = room.members.some((data) => data.ID === user.ID)

          if (!isMember) {
            throw new UserInputError('Action not allowed')
          }
          return pubsub.asyncIterator(`Paragraph_${roomId}`)
          console.log(k)
        } catch (error) {
          throw new Error('An error occurred: ' + error.message)
        }
      },
    },
  },
}
