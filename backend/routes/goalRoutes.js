const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  submitGoals,
  updateGoalStatus
} = require('../controllers/goalController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(authorize('Employee'), createGoal);

router.post('/submit', authorize('Employee'), submitGoals);

router.route('/:id')
  .put(updateGoal); // both employee and manager can update depending on status

router.put('/:id/status', authorize('Manager'), updateGoalStatus);

module.exports = router;
