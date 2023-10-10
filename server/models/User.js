const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  createdAt: String,
  ID: String,
});

const User = model("User", userSchema, "User"); // Model name is "User"

module.exports = User;
