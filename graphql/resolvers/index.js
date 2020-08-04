const { events, createEvent } = require("./events");
const { bookings, bookEvent, cancelBooking } = require("./booking");
const { createUser } = require("./auth");

// Resolvers
module.exports = {
  createUser,
  events,
  createEvent,
  bookings,
  bookEvent,
  cancelBooking,
};
