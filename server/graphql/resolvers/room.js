const { AuthenticationError, UserInputError } = require("apollo-server");
const Room = require("../../models/Room.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

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
      if (!user) throw AuthenticationError("Not authorized");
      let Errors = {};
      if (name.trim() === "") Errors.name = "name must not be empty";
      if (password.trim() === "")
        Errors.password = "password must not be empty";
      if (Object.keys(Errors).length > 0) throw Errors;

      const room = await Room.findOne({ name: name });
      if (!room) throw new UserInputError("Room not found");

      const match = await bcrypt.compare(password, room.password);

      if (match) throw new UserInputError("Incorrect Credentials");

      const joinedRoom = await Room.findOneAndUpdate(
        { name: name },
        { $push: { members: { ID: user.ID } } },
        { new: true }
      );
      console.log(joinedRoom);

      return joinedRoom;
    },
  },
};
