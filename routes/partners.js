const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const PartnerController = require('../controllers/PartnerController');

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partners
 *     tags:
 *       - Partners
 *     responses:
 *       200:
 *         description: List of partners
 */
router.get('/', requireAuth, PartnerController.getAllPartners);
/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Get partner by ID
 *     tags:
 *       - Partners
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Partner details
 */
router.get('/:id', requireAuth, PartnerController.getPartnerById);
/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create a new partner
 *     tags:
 *       - Partners
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       201:
 *         description: Partner created
 */
router.post('/', requireAuth, requireRole(['admin', 'gestionnaire']), PartnerController.createPartner);
/**
 * @swagger
 * /api/partners/{id}:
 *   patch:
 *     summary: Update partner
 *     tags:
 *       - Partners
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
*             $ref: '#/components/schemas/Partner'
*     responses:
*       200:
*         description: Partner updated
 */
router.patch('/:id', requireAuth, requireRole(['admin', 'gestionnaire']), PartnerController.updatePartner);
/**
 * @swagger
* /api/partners/{id}:
*   delete:
*     summary: Delete partner
*     tags:
*       - Partners
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Partner deleted
*/
router.delete('/:id', requireAuth, requireRole(['admin']), PartnerController.deletePartner);

module.exports = router;
