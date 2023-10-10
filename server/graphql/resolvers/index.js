const usersResolver = require("./users.js");

module.exports = {
  Query: {
    ...usersResolver.Query,
  },
};
