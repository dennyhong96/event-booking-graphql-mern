const Booking = require("../../models/Booking");
const {
  creatorField,
  userField,
  eventField,
} = require("../../utils/populates");

// Booking Resolvers
module.exports = {
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
