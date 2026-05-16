const SystemConfig = require('../models/SystemConfig');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Goal = require('../models/Goal');

// @desc    Get system config (cycle)
// @route   GET /api/admin/config
// @access  Private (Admin)
const getConfig = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }
    res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};

// @desc    Update system config (cycle)
// @route   PUT /api/admin/config
// @access  Private (Admin)
const updateConfig = async (req, res, next) => {
  try {
    const { currentCycle } = req.body;
    let config = await SystemConfig.findOne();
    
    if (!config) {
      config = await SystemConfig.create({ currentCycle });
    } else {
      config.currentCycle = currentCycle;
      await config.save();
    }
    
    res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('managerId', 'name email');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign manager to user
// @route   PUT /api/admin/users/:id/manager
// @access  Private (Admin)
const assignManager = async (req, res, next) => {
  try {
    const { managerId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    user.managerId = managerId;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('performedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Unlock a goal
// @route   PUT /api/admin/goals/:id/unlock
// @access  Private (Admin)
const unlockGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
       res.status(404);
       return next(new Error('Goal not found'));
    }

    goal.status = 'Draft';
    await goal.save();

    await AuditLog.create({
      action: 'ADMIN_UNLOCK_GOAL',
      entityType: 'Goal',
      entityId: goal._id,
      performedBy: req.user._id
    });

    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfig,
  updateConfig,
  getUsers,
  assignManager,
  getAuditLogs,
  unlockGoal
};
