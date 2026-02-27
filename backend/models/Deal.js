const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a deal title'],
  },
  value: {
    type: Number,
    required: [true, 'Please add a deal value'],
    default: 0,
  },
  stage: {
    type: String,
    enum: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Lead',
  },
  linkedLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },
  linkedContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expectedCloseDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Deal', dealSchema);
