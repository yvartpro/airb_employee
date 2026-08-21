const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const EmployeeController = require('../controllers/EmployeeController');

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', requireAuth, EmployeeController.getAllEmployees);
/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Employee details
 */
router.get('/:id', requireAuth, EmployeeController.getEmployeeById);
/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags:
 *       - Employees
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), uploadSingle, EmployeeController.createEmployee);
/**
 * @swagger
 * /api/employees/{id}:
 *   patch:
 *     summary: Update employee
 *     tags:
 *       - Employees
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
*             $ref: '#/components/schemas/Employee'
*     responses:
*       200:
*         description: Employee updated
 */
router.patch('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), uploadSingle, EmployeeController.updateEmployee);
/**
 * @swagger
* /api/employees/{id}:
*   delete:
*     summary: Delete employee
*     tags:
*       - Employees
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Employee deleted
*/
router.delete('/:id', requireAuth, requireRole(['admin']), EmployeeController.deleteEmployee);

module.exports = router;
