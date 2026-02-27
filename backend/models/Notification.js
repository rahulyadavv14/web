const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['lead_assigned', 'deal_assigned', 'general'],
    default: 'general',
  },
  isRead: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('Notification', notificationSchema);
