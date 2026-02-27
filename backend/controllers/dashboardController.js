const Lead = require('../models/Lead');
const Deal = require('../models/Deal');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Total leads count
    const totalLeads = await Lead.countDocuments();

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total deals in pipeline
    const totalDeals = await Deal.countDocuments();

    // Deals by stage
    const dealsByStage = await Deal.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
    ]);

    // Total revenue (sum of all closed won deals)
    const revenueData = await Deal.aggregate([
      {
        $match: { stage: 'Closed Won' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$value' },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Pipeline value (sum of all deals not closed lost)
    const pipelineData = await Deal.aggregate([
      {
        $match: { stage: { $ne: 'Closed Lost' } },
      },
      {
        $group: {
          _id: null,
          pipelineValue: { $sum: '$value' },
        },
      },
    ]);

    const pipelineValue = pipelineData.length > 0 ? pipelineData[0].pipelineValue : 0;

    // Monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Deal.aggregate([
      {
        $match: {
          stage: 'Closed Won',
          updatedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
          },
          revenue: { $sum: '$value' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Deal conversion rate
    const totalClosedDeals = await Deal.countDocuments({
      stage: { $in: ['Closed Won', 'Closed Lost'] },
    });
    const wonDeals = await Deal.countDocuments({ stage: 'Closed Won' });
    const conversionRate = totalClosedDeals > 0 ? (wonDeals / totalClosedDeals) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        leadsByStatus,
        totalDeals,
        dealsByStage,
        totalRevenue,
        pipelineValue,
        monthlyRevenue,
        conversionRate: conversionRate.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
