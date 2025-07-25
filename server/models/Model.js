const mongoose = require('mongoose');

const glbviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('GLBViewer', glbviewerSchema);