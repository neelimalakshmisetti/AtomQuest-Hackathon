const QuarterlyCheckin = require('../models/QuarterlyCheckin');
const Goal = require('../models/Goal');

// Progress calculation logic
const calculateProgress = (plannedTarget, actualAchievement, uomType) => {
    let progress = 0;
    
    // Safety check for zeros or missing values
    if (!plannedTarget && uomType !== 'Zero-based') return 0;
    
    switch(uomType) {
        case 'Numeric':
        case 'Percentage':
            // Min type usually
            progress = (actualAchievement / plannedTarget) * 100;
            break;
        case 'Zero-based':
            // If achievement = 0, progress = 100% else 0%
            progress = actualAchievement === 0 ? 100 : 0;
            break;
        case 'Timeline':
            // Custom logic depending on date, let's say 100% if completed
            progress = actualAchievement > 0 ? 100 : 0;
            break;
        default:
            progress = (actualAchievement / plannedTarget) * 100;
    }
    
    // Cap at 100% usually, but sometimes can exceed. We'll cap at 100 for this implementation.
    return Math.min(Math.max(progress, 0), 100);
};

// @desc    Submit quarterly check-in
// @route   POST /api/checkins
// @access  Private (Employee)
const submitCheckin = async (req, res, next) => {
  try {
    const { goalId, quarter, actualAchievement, status } = req.body;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      res.status(404);
      return next(new Error('Goal not found'));
    }

    if (goal.employeeId.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to check-in for this goal'));
    }

    if (goal.status !== 'Approved') {
        res.status(400);
        return next(new Error('Can only check-in on approved goals'));
    }

    // Calculate progress based on UOM type
    const progressPercentage = calculateProgress(goal.target, actualAchievement, goal.uomType);

    const checkin = await QuarterlyCheckin.create({
      goalId,
      employeeId: req.user._id,
      quarter,
      plannedTarget: goal.target,
      actualAchievement,
      status,
      progressPercentage
    });

    // Optionally update overall goal progress based on latest check-in
    // If Q4, we might just set the goal progress to this checkin's progress
    goal.progress = progressPercentage;
    await goal.save();

    res.status(201).json(checkin);
  } catch (error) {
    next(error);
  }
};

// @desc    Get checkins for a goal
// @route   GET /api/checkins/:goalId
// @access  Private
const getCheckins = async (req, res, next) => {
  try {
    const checkins = await QuarterlyCheckin.find({ goalId: req.params.goalId }).sort({ createdAt: -1 });
    res.status(200).json(checkins);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitCheckin,
  getCheckins
};
