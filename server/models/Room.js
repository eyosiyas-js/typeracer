const { model, Schema } = require("mongoose");

const roomSchema = new Schema({
  name: String,
  password: String,
  ID: String,
  status: Boolean,
  owner: String,
  members: [{ ID: String, username: String }],
});

const Room = model("Room", roomSchema, "Room"); // Model name is "Room"

module.exports = Room;
