const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdEvents: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
        autoPopulate: true,
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
