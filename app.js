require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const Event = require("./models/Event");

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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
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
    },
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server up on port ${port}...`));
