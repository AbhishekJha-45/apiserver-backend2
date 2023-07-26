const mongoose = require("mongoose");
const rating = new mongoose.Schema({
  posts: {
    type: {
      id: Number,
      post_url: String,
      posts_count: Number,
    },
    required: true,
    default: {},
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.UTC,
  },
  
});

module.exports = mongoose.model("Rating", rating);
