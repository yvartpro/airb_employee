const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const SalaryController = require('../controllers/SalaryController');

/**
 * @swagger
 * /api/salary:
 *   get:
 *     summary: Get all salary settings
 *     tags:
 *       - Salary
 *     responses:
 *       200:
 *         description: List of salary settings
 */
router.get('/', requireAuth, SalaryController.getAllSalarySettings);
/**
 * @swagger
 * /api/salary/{id}:
 *   get:
 *     summary: Get salary setting by ID
 *     tags:
 *       - Salary
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Salary setting details
 */
router.get('/:id', requireAuth, SalaryController.getSalarySettingById);
/**
 * @swagger
 * /api/salary:
 *   post:
 *     summary: Create a new salary setting
 *     tags:
 *       - Salary
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalarySetting'
 *     responses:
 *       201:
 *         description: Salary setting created
 */
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), SalaryController.createSalarySetting);
/**
 * @swagger
 * /api/salary/{id}:
 *   patch:
 *     summary: Update salary setting
 *     tags:
 *       - Salary
 *     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/SalarySetting'
*     responses:
*       200:
*         description: Salary setting updated
 */
router.patch('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), SalaryController.updateSalarySetting);
/**
 * @swagger
 * /api/salary/{id}:
 *   delete:
 *     summary: Delete salary setting
 *     tags:
 *       - Salary
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Salary setting deleted
 */
router.delete('/:id', requireAuth, requireRole(['admin']), SalaryController.deleteSalarySetting);

module.exports = router;
