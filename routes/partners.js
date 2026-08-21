const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const PartnerController = require('../controllers/PartnerController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *         contactPhone:
 *           type: string
 *         status:
 *           type: string
 *           enum: [actif, a_revoir, expire]
 *         defaultCommissionRate:
 *           type: number
 *         avatarUrl:
 *           type: string
 */

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
 *                     $ref: '#/components/schemas/Partner'
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
 *                   $ref: '#/components/schemas/Partner'
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
 *                   $ref: '#/components/schemas/Partner'
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
*                   $ref: '#/components/schemas/Partner'
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
router.delete('/:id', requireAuth, requireRole(['admin']), PartnerController.deletePartner);

module.exports = router;
