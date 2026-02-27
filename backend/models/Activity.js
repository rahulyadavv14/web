const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'lead_created',
      'lead_updated',
      'lead_deleted',
      'lead_assigned',
      'contact_created',
      'contact_updated',
      'contact_deleted',
      'deal_created',
      'deal_updated',
      'deal_stage_changed',
      'deal_deleted',
      'note_added',
    ],
  },
  description: {
    type: String,
    required: true,
  },
  relatedModel: {
    type: String,
    enum: ['Lead', 'Contact', 'Deal'],
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', activitySchema);
