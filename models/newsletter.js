const mongoose = require("mongoose");
const newsletter = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  post: {
    type: [
      {
        id: Number,
        post_url: String,
      },
    ],
    required: true,
    default: {},
  },
  subscribed_at: {
    type: Date,
    required: true,
    default: Date.UTC,
  },
});

module.exports = mongoose.model("NewsLetter", newsletter);
