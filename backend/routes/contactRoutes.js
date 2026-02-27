const express = require('express');
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  addNote,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, createContact);

router
  .route('/:id')
  .get(protect, getContact)
  .put(protect, updateContact)
  .delete(protect, deleteContact);

router.post('/:id/notes', protect, addNote);

module.exports = router;
