const mongoose = require('mongoose');

let IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  assigned: {
    type: String
  },
  status: {
    type: String
  },
  created_on: {
    type: Date,
    default: Date.now()
  },
  updated_on: {
    type: Date
  },
  open: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Issue', IssueSchema);
