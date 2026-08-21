const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ActivityLogController = require('../controllers/ActivityLogController');

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Get all activity logs
 *     tags:
 *       - ActivityLogs
 *     responses:
 *       200:
 *         description: List of activity logs
 */
router.get('/', requireAuth, ActivityLogController.getAllActivityLogs);
/**
 * @swagger
 * /api/activity-logs/stats:
 *   get:
 *     summary: Get activity statistics
 *     tags:
 *       - ActivityLogs
 *     responses:
 *       200:
 *         description: Activity statistics
 */
router.get('/stats', requireAuth, ActivityLogController.getActivityStats);
/**
 * @swagger
 * /api/activity-logs/user/{userId}:
 *   get:
 *     summary: Get activity logs for a user
 *     tags:
 *       - ActivityLogs
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User activity logs
 */
router.get('/user/:userId', requireAuth, ActivityLogController.getUserActivityLogs);
/**
 * @swagger
 * /api/activity-logs/entity/{entityType}/{entityId}:
 *   get:
 *     summary: Get activity logs for an entity
 *     tags:
 *       - ActivityLogs
 *     parameters:
 *       - in: path
 *         name: entityType
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: entityId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Entity activity logs
 */
router.get('/entity/:entityType/:entityId', requireAuth, ActivityLogController.getEntityActivityLogs);
/**
 * @swagger
 * /api/activity-logs/{id}:
*   get:
*     summary: Get activity log by ID
*     tags:
*       - ActivityLogs
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Activity log details
*/
router.get('/:id', requireAuth, ActivityLogController.getActivityLogById);

module.exports = router;
