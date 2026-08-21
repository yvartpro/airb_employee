const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const AssignmentController = require('../controllers/AssignmentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       required:
 *         - startDate
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         employeeId:
 *           type: integer
 *         partnerId:
 *           type: integer
 *         contractType:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         durationMonths:
 *           type: integer
 *         renewable:
 *           type: boolean
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [actif, termine, a_renouveler]
 */

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags:
 *       - Assignments
 *     responses:
 *       200:
 *         description: List of assignments
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
 *                     $ref: '#/components/schemas/Assignment'
 */
router.get('/', requireAuth, AssignmentController.getAllAssignments);
/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Assignment details
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
 *                   $ref: '#/components/schemas/Assignment'
 */
router.get('/:id', requireAuth, AssignmentController.getAssignmentById);
/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags:
 *       - Assignments
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created
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
 *                   $ref: '#/components/schemas/Assignment'
 */
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), AssignmentController.createAssignment);
/**
 * @swagger
* /api/assignments/{id}:
*   put:
*     summary: Update assignment
*     tags:
*       - Assignments
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
*             $ref: '#/components/schemas/Assignment'
*     responses:
*       200:
*         description: Assignment updated
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
*                   $ref: '#/components/schemas/Assignment'
*/
router.put('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), AssignmentController.updateAssignment);
/**
 * @swagger
* /api/assignments/{id}:
*   delete:
*     summary: Delete assignment
*     tags:
*       - Assignments
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Assignment deleted
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
router.delete('/:id', requireAuth, requireRole(['admin']), AssignmentController.deleteAssignment);

module.exports = router;
