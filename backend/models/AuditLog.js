const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String, // e.g., 'UPDATE_GOAL', 'APPROVE_GOAL'
    required: true
  },
  entityType: {
    type: String, // e.g., 'Goal', 'QuarterlyCheckin'
    required: true
  },
  entityId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed // Can store an object representing the previous state
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  },
  performedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
