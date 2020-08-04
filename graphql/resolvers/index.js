const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingsResolver = require("./booking");

// Resolvers
module.exports = {
  ...authResolver,
  ...eventsResolver,
  ...bookingsResolver,
};
