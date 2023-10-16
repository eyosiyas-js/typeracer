const { AuthenticationError, UserInputError } = require("apollo-server");
const Room = require("../../models/Room.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { withFilter } = require("graphql-subscriptions");

module.exports = {
  Query: {},
  Mutation: {
    async createRoom(_, { name, password }, { user }) {
      if (!user) throw AuthenticationError("Not authorized");
      let Errors = {};
      if (name.trim() === "") Errors.name = "name must not be empty";
      if (password.trim() === "")
        Errors.password = "password must not be empty";
      if (Object.keys(Errors).length > 0) throw Errors;

      const HashedPassword = await bcrypt.hash(password, 6);

      const newRoom = await Room.create({
        name: name,
        password: HashedPassword,
        ID: uuidv4(),
        status: false,
        owner: user.ID,
        members: [{ ID: user.ID }],
      });
      return newRoom;
    },
    async joinRoom(_, { name, password }, { user }) {
      if (!user) throw new AuthenticationError("Not authorized");
      let Errors = {};
      if (name.trim() === "") Errors.name = "name must not be empty";
      if (password.trim() === "")
        Errors.password = "password must not be empty";
      if (Object.keys(Errors).length > 0) throw Errors;

      const room = await Room.findOne({ name: name });
      if (!room) throw new UserInputError("Room not found");

      const match = await bcrypt.compare(password, room.password);

      if (match) throw new UserInputError("Incorrect Credentials");

      let found = false;

      room.members.map((data) => {
        if (data.ID === user.ID) {
          console.log(true);
          found = true;
        }
      });

      if (!found) {
        const joinedRoom = await Room.findOneAndUpdate(
          { name: name },
          { $push: { members: { ID: user.ID } } },
          { new: true }
        );
        return joinedRoom;
      }
      // console.log(joinedRoom)
      return room;
    },

    async sendRank(_, { roomId, ID, Rank }, { pubsub, user }) {
      if (!user) throw new AuthenticationError("Not authorized");

      const room = await Room.findOne({ ID: roomId });

      if (!room) return new UserInputError("Room not found");

      room.members.map((data) => {
        if (data.ID !== user.ID) {
          return new UserInputError("Action not allowed");
        }
      });

      pubsub.publish(`NEW_RANK_${room.ID}`, {
        newRank: Rank,
        ID: ID,
        roomId: roomId,
      });
      return Rank;
    },
  },

  Subscription: {
    newRank: {
      subscribe: withFilter(
        (_, { roomId, ID, Rank }, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");

          // Subscribe to the channel specific to the room
          return pubsub.asyncIterator(`NEW_RANK_${roomId}`);
        },
        ({ newRank, ID, roomId }, _, { user }) => {
          // Check if the authenticated user is a member of the room
          if (newRank.roomId && newRank.roomId === roomId) {
            return { Rank: newRank, ID: ID, roomId: roomId };
          }

          return false;
        }
      ),
    },
  },
};
