const express = require('express');
const router = express.Router();
const {
  getConfig,
  updateConfig,
  getUsers,
  assignManager,
  getAuditLogs,
  unlockGoal
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('Admin'));

router.route('/config')
  .get(getConfig)
  .put(updateConfig);

router.route('/users')
  .get(getUsers);

router.put('/users/:id/manager', assignManager);

router.get('/audit-logs', getAuditLogs);

router.put('/goals/:id/unlock', unlockGoal);

module.exports = router;
