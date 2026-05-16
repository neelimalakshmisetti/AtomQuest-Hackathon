const express = require('express');
const router = express.Router();
const {
  submitCheckin,
  getCheckins
} = require('../controllers/checkinController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(authorize('Employee'), submitCheckin);

router.route('/:goalId')
  .get(getCheckins);

module.exports = router;
