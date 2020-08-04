require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

const schema = require("./graphql/schema/index");
const rootValue = require("./graphql/resolvers/index");
const isAuth = require("./middlewares/isAuth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(isAuth);

// GraphQL server
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server up on port ${port}...`));
