const Event = require("../../models/Event");
const User = require("../../models/User");
const { creatorField } = require("../../utils/populates");

// Event Resolvers
module.exports = {
  // Get all events
  events: async () => {
    try {
      const events = await Event.find()
        .sort({ createdAt: -1 })
        .populate(creatorField);
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
        creator: req.userId,
      });
      await User.findByIdAndUpdate(
        req.userId,
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
