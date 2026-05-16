const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  thrustArea: {
    type: String,
    required: [true, 'Please select a thrust area']
  },
  uomType: {
    type: String,
    enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'],
    required: [true, 'Please select a Unit of Measurement type']
  },
  target: {
    type: Number, // For numeric, percentage. For zero-based, target is 0.
    required: function() { return this.uomType !== 'Timeline'; }
  },
  timelineDate: {
    type: Date,
    required: function() { return this.uomType === 'Timeline'; }
  },
  weightage: {
    type: Number,
    required: [true, 'Please add a weightage'],
    min: [10, 'Minimum individual goal weightage is 10%'],
    max: [100, 'Weightage cannot exceed 100%']
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  progress: {
    type: Number, // Overall calculated progress
    default: 0
  },
  isShared: {
    type: Boolean,
    default: false
  },
  managerComment: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);
