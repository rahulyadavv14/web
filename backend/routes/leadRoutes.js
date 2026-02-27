const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  addNote,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getLeads).post(protect, createLead);

router
  .route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.post('/:id/notes', protect, addNote);

module.exports = router;
