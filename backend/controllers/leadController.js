const Lead = require('../models/Lead');
const logActivity = require('../utils/logActivity');
const createNotification = require('../utils/createNotification');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const lead = await Lead.create(req.body);

    // Log activity
    await logActivity(
      req.user.id,
      'lead_created',
      `Created lead: ${lead.name}`,
      'Lead',
      lead._id
    );

    // Create notification if lead is assigned
    if (req.body.assignedTo && req.body.assignedTo !== req.user.id) {
      await createNotification(
        req.body.assignedTo,
        `A new lead "${lead.name}" has been assigned to you`,
        'lead_assigned',
        'Lead',
        lead._id
      );
    }

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const oldAssignedTo = lead.assignedTo?.toString();
    req.body.updatedAt = Date.now();

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log activity
    await logActivity(
      req.user.id,
      'lead_updated',
      `Updated lead: ${lead.name}`,
      'Lead',
      lead._id
    );

    // Create notification if lead is reassigned
    if (
      req.body.assignedTo &&
      req.body.assignedTo !== oldAssignedTo &&
      req.body.assignedTo !== req.user.id
    ) {
      await createNotification(
        req.body.assignedTo,
        `Lead "${lead.name}" has been assigned to you`,
        'lead_assigned',
        'Lead',
        lead._id
      );

      await logActivity(
        req.user.id,
        'lead_assigned',
        `Assigned lead "${lead.name}" to another user`,
        'Lead',
        lead._id
      );
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await lead.deleteOne();

    // Log activity
    await logActivity(
      req.user.id,
      'lead_deleted',
      `Deleted lead: ${lead.name}`,
      'Lead',
      lead._id
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

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    lead.notes.push({
      content: req.body.content,
      createdBy: req.user.id,
    });

    await lead.save();

    // Log activity
    await logActivity(
      req.user.id,
      'note_added',
      `Added note to lead: ${lead.name}`,
      'Lead',
      lead._id
    );

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
