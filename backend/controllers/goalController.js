const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// @desc    Get goals (Employee gets own, Manager gets team's)
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'Employee') {
      query = Goal.find({ employeeId: req.user._id });
    } else if (req.user.role === 'Manager') {
      // Find employees reporting to this manager
      const team = await User.find({ managerId: req.user._id }).select('_id');
      const teamIds = team.map(member => member._id);
      query = Goal.find({ employeeId: { $in: teamIds } }).populate('employeeId', 'name email');
    } else if (req.user.role === 'Admin') {
      query = Goal.find().populate('employeeId', 'name email department');
    }

    const goals = await query;
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private (Employee)
const createGoal = async (req, res, next) => {
  try {
    if (req.user.role !== 'Employee') {
      res.status(403);
      return next(new Error('Only employees can create goals'));
    }

    const newGoal = { ...req.body, employeeId: req.user._id, status: 'Draft' };
    const goal = await Goal.create(newGoal);

    await AuditLog.create({
      action: 'CREATE_GOAL',
      entityType: 'Goal',
      entityId: goal._id,
      newValue: goal,
      performedBy: req.user._id
    });

    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      return next(new Error('Goal not found'));
    }

    // Check permissions
    if (req.user.role === 'Employee') {
      if (goal.employeeId.toString() !== req.user._id.toString()) {
        res.status(401);
        return next(new Error('Not authorized to update this goal'));
      }
      if (goal.status === 'Approved' || goal.status === 'Pending Approval') {
        res.status(400);
        return next(new Error(`Cannot edit goal in ${goal.status} status`));
      }
    } else if (req.user.role === 'Manager') {
      // Manager can inline edit weightage and target if pending
      // Wait, let's allow managers to edit goals of their team
      const employee = await User.findById(goal.employeeId);
      if (employee.managerId.toString() !== req.user._id.toString()) {
         res.status(401);
         return next(new Error('Not authorized to edit this team members goal'));
      }
    }

    const oldGoal = { ...goal.toObject() };
    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await AuditLog.create({
      action: 'UPDATE_GOAL',
      entityType: 'Goal',
      entityId: goal._id,
      oldValue: oldGoal,
      newValue: goal,
      performedBy: req.user._id
    });

    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit goals for approval
// @route   POST /api/goals/submit
// @access  Private (Employee)
const submitGoals = async (req, res, next) => {
  try {
    // Get all draft goals for employee
    const goals = await Goal.find({ employeeId: req.user._id, status: { $in: ['Draft', 'Rejected'] } });
    
    if (goals.length === 0) {
      res.status(400);
      return next(new Error('No draft goals found to submit'));
    }

    if (goals.length > 8) {
      res.status(400);
      return next(new Error('Maximum 8 goals allowed'));
    }

    const totalWeightage = goals.reduce((acc, curr) => acc + curr.weightage, 0);

    if (totalWeightage !== 100) {
      res.status(400);
      return next(new Error(`Total weightage must be 100%. Current is ${totalWeightage}%`));
    }

    // Update status to Pending Approval
    await Goal.updateMany(
      { employeeId: req.user._id, status: { $in: ['Draft', 'Rejected'] } },
      { $set: { status: 'Pending Approval' } }
    );

    res.status(200).json({ message: 'Goals submitted for approval' });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject goal
// @route   PUT /api/goals/:id/status
// @access  Private (Manager)
const updateGoalStatus = async (req, res, next) => {
    try {
        if (req.user.role !== 'Manager') {
            res.status(403);
            return next(new Error('Only managers can change goal status'));
        }

        const { status, managerComment } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            res.status(400);
            return next(new Error('Invalid status'));
        }

        let goal = await Goal.findById(req.params.id);
        if (!goal) {
            res.status(404);
            return next(new Error('Goal not found'));
        }

        const oldGoal = { ...goal.toObject() };
        
        goal.status = status;
        if (managerComment) goal.managerComment = managerComment;
        
        await goal.save();

        await AuditLog.create({
            action: `STATUS_CHANGE_${status.toUpperCase()}`,
            entityType: 'Goal',
            entityId: goal._id,
            oldValue: oldGoal,
            newValue: goal,
            performedBy: req.user._id
        });

        res.status(200).json(goal);
    } catch (error) {
        next(error);
    }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  submitGoals,
  updateGoalStatus
};
