const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: false
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User