const bcrypt = require("bcryptjs");

const Event = require("../../models/Event");
const User = require("../../models/User");

// Merging helpers
// const populateCreator = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     return {
//       ...user._doc,
//       createdEvents: populateEvents(user._doc.createdEvents),
//     };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// const populateEvents = async (eventIds) => {
//   try {
//     return (await Event.find({ _id: { $in: eventIds } })).map((event) => ({
//       ...event._doc,
//       creator: populateCreator(event._doc.creator),
//     }));
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

const populateCreator = {
  path: "creator",
  select: "-password",
  populate: {
    path: "createdEvents",
    populate: {
      path: "creator",
      select: "-password",
    },
  },
};

// Resolvers
module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate(populateCreator);
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
      return await Event.findById(event.id).populate(populateCreator);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const { email, password: plainPassword } = args.userInput;
      const password = await bcrypt.hash(plainPassword, 12);
      // Get rid of the password field, ._doc gives a plain js object
      let user = { ...(await User.create({ email, password }))._doc };
      delete user.password;
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

/*
events: async () => {
    try {
      const events = (await Event.find()).map((event) => ({
        ...event._doc,
        creator: populateCreator(event._doc.creator),
      }));
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
      return {
        ...event._doc,
        creator: populateCreator(event._doc.creator),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const { email, password: plainPassword } = args.userInput;
      const password = await bcrypt.hash(plainPassword, 12);
      // Get rid of the password field, ._doc gives a plain js object
      let user = { ...(await User.create({ email, password }))._doc };
      delete user.password;
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


*/
