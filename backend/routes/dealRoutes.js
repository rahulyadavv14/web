const express = require('express');
const {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealStage,
} = require('../controllers/dealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getDeals).post(protect, createDeal);

router
  .route('/:id')
  .get(protect, getDeal)
  .put(protect, updateDeal)
  .delete(protect, deleteDeal);

router.patch('/:id/stage', protect, updateDealStage);

module.exports = router;
