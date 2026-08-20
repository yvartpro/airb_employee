const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const AssignmentController = require('../controllers/AssignmentController');

router.get('/', requireAuth, AssignmentController.getAllAssignments);
router.get('/:id', requireAuth, AssignmentController.getAssignmentById);
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), AssignmentController.createAssignment);
router.put('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), AssignmentController.updateAssignment);
router.delete('/:id', requireAuth, requireRole(['admin']), AssignmentController.deleteAssignment);

module.exports = router;
