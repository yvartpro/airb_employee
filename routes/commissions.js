const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const CommissionController = require('../controllers/CommissionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Commission:
 *       type: object
 *       required:
 *         - amount
 *         - transactionDate
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         salarySetting_id:
 *           type: integer
 *         employeeId:
 *           type: integer
 *         partnerId:
 *           type: integer
 *         amount:
 *           type: number
 *         period:
 *           type: string
 *           enum: [jour, mois, trimestre, annee]
 *         transactionDate:
 *           type: string
 *           format: date-time
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Commission'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Commission'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Commission'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Commission'
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
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                 data:
*                   type: object
*/
router.delete('/:id', requireAuth, requireRole(['admin']), CommissionController.deleteCommission);

module.exports = router;
