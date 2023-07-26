const mongoose = require("mongoose");
const authors = new mongoose.Schema({
  author_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  total_posts: {
    type: Number,
    required: true,
  },
  display_picture: {
    type: String,
    required: true,
    default: "",
  },
  posts: {
    type: [
      {
        id: Number,
        post_url: String,
      },
    ],
    required: true,
    default: {},
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
