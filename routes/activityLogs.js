const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ActivityLogController = require('../controllers/ActivityLogController');

router.get('/', requireAuth, ActivityLogController.getAllActivityLogs);
router.get('/stats', requireAuth, ActivityLogController.getActivityStats);
router.get('/user/:userId', requireAuth, ActivityLogController.getUserActivityLogs);
router.get('/entity/:entityType/:entityId', requireAuth, ActivityLogController.getEntityActivityLogs);
router.get('/:id', requireAuth, ActivityLogController.getActivityLogById);

module.exports = router;
