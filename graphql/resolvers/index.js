const bcrypt = require("bcryptjs");

const Event = require("../../models/Event");
const User = require("../../models/User");
const Booking = require("../../models/Booking");
const {
  creatorField,
  userField,
  eventField,
} = require("../../utils/populates");

// Resolvers
module.exports = {
  // Get all events
  events: async () => {
    try {
      const events = await Event.find().populate(creatorField);
      return events;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Get all bookings
  bookings: async () => {
    try {
      const bookings = await Booking.find()
        .populate(userField)
        .populate(eventField);
      return bookings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create an event
  createEvent: async (args) => {
    try {
      const event = await Event.create({
        ...args.eventInput,
        price: +args.eventInput.price,
        creator: "5f27fe3aa52c83ba175bb1c0",
      });
      await User.findByIdAndUpdate(
        "5f27fe3aa52c83ba175bb1c0",
        {
          $push: { createdEvents: event },
        },
        { runValidators: true }
      );
      return await Event.findById(event.id).populate(creatorField);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create an user
  createUser: async (args) => {
    try {
      const { email, password: plainPassword } = args.userInput;
      const password = await bcrypt.hash(plainPassword, 12);
      const user = { ...(await User.create({ email, password }))._doc };
      delete user.password;
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create a booking
  bookEvent: async (args) => {
    try {
      const event = Event.findById(args.eventId);
      if (!event) throw new Error("Event not found");
      const booking = await Booking.create({
        event: args.eventId,
        user: "5f27fe3aa52c83ba175bb1c0",
      });
      return await Booking.findById(booking._id)
        .populate(userField)
        .populate(eventField);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (args) => {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(args.bookingId);
      if (!deletedBooking) throw new Error("Booking not found");
      const event = await Event.findById(deletedBooking.event).populate(
        creatorField
      );
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
