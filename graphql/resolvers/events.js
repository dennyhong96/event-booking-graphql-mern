const Event = require("../../models/Event");
const { creatorField } = require("../../utils/populates");

// Event Resolvers
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

  // Create an event
  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Please log in");
      }
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
};
