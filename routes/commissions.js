const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const CommissionController = require('../controllers/CommissionController');

/**
 * @swagger
 * /api/commissions:
 *   get:
 *     summary: Get all commissions
 *     tags:
 *       - Commissions
 *     responses:
 *       200:
 *         description: List of commissions
 */
router.get('/', requireAuth, CommissionController.getAllCommissions);
/**
 * @swagger
 * /api/commissions/summary:
 *   get:
 *     summary: Get commission summary
 *     tags:
 *       - Commissions
 *     responses:
 *       200:
 *         description: Commission summary
 */
router.get('/summary', requireAuth, CommissionController.getCommissionSummary);
/**
 * @swagger
 * /api/commissions/{id}:
 *   get:
 *     summary: Get commission by ID
 *     tags:
 *       - Commissions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Commission details
 */
router.get('/:id', requireAuth, CommissionController.getCommissionById);
/**
 * @swagger
 * /api/commissions:
 *   post:
 *     summary: Create a new commission
 *     tags:
 *       - Commissions
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commission'
 *     responses:
 *       201:
 *         description: Commission created
 */
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), CommissionController.createCommission);
/**
 * @swagger
* /api/commissions/{id}:
*   delete:
*     summary: Delete commission
*     tags:
*       - Commissions
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Commission deleted
*/
router.delete('/:id', requireAuth, requireRole(['admin']), CommissionController.deleteCommission);

module.exports = router;
