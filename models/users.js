const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
