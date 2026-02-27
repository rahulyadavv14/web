const Deal = require('../models/Deal');
const logActivity = require('../utils/logActivity');
const createNotification = require('../utils/createNotification');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
exports.getDeals = async (req, res) => {
  try {
    const filter = {};
    if (req.query.stage) {
      filter.stage = req.query.stage;
    }

    const deals = await Deal.find(filter)
      .populate('linkedLead', 'name email')
      .populate('linkedContact', 'name email')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
exports.getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('linkedLead', 'name email')
      .populate('linkedContact', 'name email')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
exports.createDeal = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const deal = await Deal.create(req.body);

    // Log activity
    await logActivity(
      req.user.id,
      'deal_created',
      `Created deal: ${deal.title} ($${deal.value})`,
      'Deal',
      deal._id
    );

    // Create notification if deal is assigned
    if (req.body.assignedTo && req.body.assignedTo !== req.user.id) {
      await createNotification(
        req.body.assignedTo,
        `A new deal "${deal.title}" ($${deal.value}) has been assigned to you`,
        'deal_assigned',
        'Deal',
        deal._id
      );
    }

    res.status(201).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
exports.updateDeal = async (req, res) => {
  try {
    let deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    const oldStage = deal.stage;
    req.body.updatedAt = Date.now();

    deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log activity for stage change
    if (req.body.stage && req.body.stage !== oldStage) {
      await logActivity(
        req.user.id,
        'deal_stage_changed',
        `Moved deal "${deal.title}" from ${oldStage} to ${deal.stage}`,
        'Deal',
        deal._id
      );
    } else {
      await logActivity(
        req.user.id,
        'deal_updated',
        `Updated deal: ${deal.title}`,
        'Deal',
        deal._id
      );
    }

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    await deal.deleteOne();

    // Log activity
    await logActivity(
      req.user.id,
      'deal_deleted',
      `Deleted deal: ${deal.title}`,
      'Deal',
      deal._id
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update deal stage (for drag and drop)
// @route   PATCH /api/deals/:id/stage
// @access  Private
exports.updateDealStage = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    const oldStage = deal.stage;
    deal.stage = req.body.stage;
    deal.updatedAt = Date.now();

    await deal.save();

    // Log activity
    await logActivity(
      req.user.id,
      'deal_stage_changed',
      `Moved deal "${deal.title}" from ${oldStage} to ${deal.stage}`,
      'Deal',
      deal._id
    );

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
