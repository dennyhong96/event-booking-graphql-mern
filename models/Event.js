const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    get: formatDate,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    autoPopulate: true,
    required: true,
  },
});

function formatDate(v) {
  return new Date(v).toISOString();
}

module.exports = mongoose.model("Event", eventSchema);
