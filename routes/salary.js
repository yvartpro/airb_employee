const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const SalaryController = require('../controllers/SalaryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SalarySetting:
 *       type: object
 *       required:
 *         - grossSalary
 *         - effectiveMonth
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         assignmentId:
 *           type: integer
 *         grossSalary:
 *           type: number
 *         commissionRate:
 *           type: number
 *         commissionAmount:
 *           type: number
 *         netSalary:
 *           type: number
 *         effectiveMonth:
 *           type: string
 *           format: date
 */

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
 *                     $ref: '#/components/schemas/SalarySetting'
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
 *                   $ref: '#/components/schemas/SalarySetting'
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
 *                   $ref: '#/components/schemas/SalarySetting'
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
*                   $ref: '#/components/schemas/SalarySetting'
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
router.delete('/:id', requireAuth, requireRole(['admin']), SalaryController.deleteSalarySetting);

module.exports = router;
