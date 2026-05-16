const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
  currentCycle: {
    type: String,
    enum: ['Goal Setting', 'Q1', 'Q2', 'Q3', 'Q4'],
    default: 'Goal Setting'
  },
  cycleStartDate: {
    type: Date,
    default: Date.now
  },
  cycleEndDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
