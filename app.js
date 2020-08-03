require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const bcrypt = require("bcryptjs");

const Event = require("./models/Event");
const User = require("./models/User");

const app = express();
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
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
      events: async () => {
        try {
          const events = await Event.find();
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
            date: new Date(args.eventInput.date),
          });
          return event;
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
