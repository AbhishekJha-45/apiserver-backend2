const mongoose = require("mongoose");
const newcaseStudy = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  post_url: {
    type: String,
    required: true,
  },
  redirect_url: {
    type: String,
    required: true,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  cannonical_tag: {
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
  top: {
    type: { para: String, para2: String, para3: String },
    required: true,
  },
  top2: {
    type: { para: String, para2: String, para3: String },
    required: true,
  },
  top3: {
    type: { para: String, para2: String, para3: String },
    required: true,
  },
  top4: {
    type: { para: String, para2: String, para3: String },
    required: true,
  },
  bottom: {
    type: { para: String, para2: String, para3: String },
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("NewCaseStudy", newcaseStudy);
