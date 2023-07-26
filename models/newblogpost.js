const mongoose = require("mongoose");
const slugify = require("slugify");

const newblogPost = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  post_url: {
    type: String,
    unique: true,
    required: true,
  },
  redirect_url: {
    type: String,
    required: true,
    default: null,
  },
  author_name: {
    type: String,
    required: true,
  },
  cannonical_tag: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  robots: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  table_of_contents: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
  },
  totalRatings: {
    type: Number,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

// Middleware to slugify the post_url field before saving
newblogPost.pre("save", function (next) {
  this.post_url = slugify(this.heading, { lower: true });
  next();
});

module.exports = mongoose.model("NewBlogPost", newblogPost);
