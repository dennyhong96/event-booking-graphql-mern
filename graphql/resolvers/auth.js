const bcrypt = require("bcryptjs");

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
};
