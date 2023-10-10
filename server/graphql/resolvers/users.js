const { UserInputError } = require("apollo-server");
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  Query: {
    async getUsers() {
      return [
        {
          username: "Deju",
        },
      ];
    },
  },
  Mutation: {
    async register(_, args) {
      const { username, password, confirmPassword } = args;
      const user = await User.findOne({ username: username });
      let Errors = {};
      if (username.trim() === "")
        Errors.username = "Username must not be empty";
      if (password.trim() === "")
        Errors.password = "password must not be empty";
      if (confirmPassword.trim() === "")
        Errors.confirmPassword = "confirmPassword must not be empty";
      if (password !== confirmPassword)
        Errors.passwords = "Passwords do not match";

      if (Object.keys(Errors).length > 0) throw Errors;

      if (user) {
        throw new UserInputError("This username is Taken!");
      } else {
        const HashedPassword = await bcrypt.hash(password, 6);
        const Newuser = await User.create({
          username: username,
          password: HashedPassword,
          createdAt: new Date().toISOString(),
          ID: uuidv4(),
        });
        const token = jwt.sign(
          {
            username: Newuser.username,
            createdAt: Newuser.createdAt,
            ID: Newuser.ID,
          },
          "mykey",
          { expiresIn: "30d" }
        );
        return {
          username: Newuser.username,
          createdAt: Newuser.createdAt,
          ID: Newuser.ID,
          token,
        };
      }
    },
    async login(_, args) {
      const { username, password } = args;
      let Errors = {};
      if (username.trim() === "")
        Errors.username = "username must not be empty";
      if (password.trim() === "")
        Errors.password = "password must not be empty";

      if (Object.keys(Errors).length > 0) throw Errors;

      const user = await User.findOne({ username: username });
      if (!user) throw new UserInputError("user not found");
      const token = jwt.sign(
        {
          username: user.username,
          createdAt: user.createdAt,
          ID: user.ID,
        },
        "mykey",
        { expiresIn: "30d" }
      );
      return {
        username: user.username,
        createdAt: user.createdAt,
        ID: user.ID,
        token,
      };
    },
  },
};
