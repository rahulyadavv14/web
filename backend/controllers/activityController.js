const Activity = require('../models/Activity');

// @desc    Get activities
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const activities = await Activity.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
