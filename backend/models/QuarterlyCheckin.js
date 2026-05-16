const mongoose = require('mongoose');

const QuarterlyCheckinSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Goal',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true
  },
  plannedTarget: {
    type: Number, // For Timeline, might store Unix timestamp or remain null
  },
  actualAchievement: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Not Started', 'On Track', 'Completed'],
    default: 'Not Started'
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  managerComment: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuarterlyCheckin', QuarterlyCheckinSchema);
