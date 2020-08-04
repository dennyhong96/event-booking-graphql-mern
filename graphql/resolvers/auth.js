const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

// Auth Resolvers
module.exports = {
  // Create an user
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
  // Login user
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email }).select("password");
      console.log(user);
      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      return {
        userId: user.id,
        token: jwt.sign(
          { userId: user.id, userEmail: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES }
        ),
        tokenExpiration: 1,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
