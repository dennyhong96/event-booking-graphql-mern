const Booking = require("../../models/Booking");
const Event = require("../../models/Event");
const {
  creatorField,
  userField,
  eventField,
} = require("../../utils/populates");

// Booking Resolvers
module.exports = {
  // Get all bookings
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Please log in");
      }
      const bookings = await Booking.find({ user: req.userId })
        .populate(userField)
        .populate(eventField);
      console.log(bookings);
      return bookings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create a booking
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Please log in");
      }
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
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Please log in");
      }
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
