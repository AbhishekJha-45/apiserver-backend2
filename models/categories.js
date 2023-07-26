const mongoose = require("mongoose");
const categories = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  posts: {
    type: {
      id: Number,
      post_url: String,
      posts_count: Number,
    },
    required: true,
    default: {},
  },
  created_by: {
    type: {
      author_name,
    },
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.UTC,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.UTC,
  },
});

module.exports = mongoose.model("Authors", authors);
