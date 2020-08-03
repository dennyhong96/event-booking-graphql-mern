const bcrypt = require("bcryptjs");

const Event = require("../../models/Event");
const User = require("../../models/User");

const creatorField = {
  path: "creator",
  populate: {
    path: "createdEvents",
    populate: {
      path: "creator",
    },
  },
};

// Resolvers
module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate(creatorField);
      return events;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
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
};
