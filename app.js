require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, isCompositeType } = require("graphql");

const bcrypt = require("bcryptjs");

const Event = require("./models/Event");
const User = require("./models/User");

const app = express();
app.use(express.json());

// Merging helpers
const populateCreator = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: populateEvents(user._doc.createdEvents),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const populateEvents = async (eventIds) => {
  try {
    return (await Event.find({ _id: { $in: eventIds } })).map((event) => ({
      ...event._doc,
      creator: populateCreator(event._doc.creator),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// GraphQL server
app.use(
  "/graphql",
  graphqlHTTP({
    // Schema
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      // Resolvers
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
    },
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server up on port ${port}...`));
