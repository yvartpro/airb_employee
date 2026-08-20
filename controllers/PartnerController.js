const { Partner, ActivityLog } = require('../models');
const { apiResponse } = require('../utils/response');

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll();
    return apiResponse(res, 200, "Partners retrieved successfully", partners)
  } catch (error) {
    console.error('Error fetching partners:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.getPartnerById = async (req, res) => {
  const { id } = req.params;
  try {
    const partner = await Partner.findByPk(id, {
      include: [
        {
          association: 'assignments',
          attributes: ['id', 'employeeId', 'contractType', 'startDate', 'status']
        }
      ]
    });

    if (!partner) return apiResponse(res, 404, 'Partner not found.')
    return apiResponse(res, 200, "Partner retrieved", partner)
  } catch (error) {
    console.error('Error fetching partner:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.createPartner = async (req, res) => {
  const { name, contactPhone, status, defaultCommissionRate } = req.body;

  if (!name) return apiResponse(res, 400, 'Partner name is required.' )

  try {
    const partner = await Partner.create({
      name,
      contactPhone,
      status: status || 'actif',
      defaultCommissionRate: defaultCommissionRate || 0
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'creation',
      entityType: 'partner',
      entityId: partner.id,
      details: { name }
    });

    return apiResponse(res, 201, 'Partner created successfully.', partner )
  } catch (error) {
    console.error('Error creating partner:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.updatePartner = async (req, res) => {
  const { id } = req.params;
  const { name, contactPhone, status, defaultCommissionRate } = req.body;

  try {
    const partner = await Partner.findByPk(id);    
    if (!partner) return apiResponse(res, 404, 'Partner not found.')


    const oldData = partner.toJSON();
    await partner.update({
      name: name || partner.name,
      contactPhone: contactPhone || partner.contactPhone,
      status: status || partner.status,
      defaultCommissionRate: defaultCommissionRate !== undefined ? defaultCommissionRate : partner.defaultCommissionRate
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'modification',
      entityType: 'partner',
      entityId: partner.id,
      details: { oldData, newData: partner.toJSON() }
    });

    return apiResponse(res, 201, 'Partner updated successfully.', partner)
  } catch (error) {
    console.error('Error updating partner:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};

exports.deletePartner = async (req, res) => {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) return apiResponse(res, 404, 'Partner not found.')
  

    const partnerData = partner.toJSON();
    await partner.destroy();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'suppression',
      entityType: 'partner',
      entityId: id,
      details: partnerData
    });

    return apiResponse(res, 200,'Partner deleted successfully.')
  } catch (error) {
    console.error('Error deleting partner:', error);
    return apiResponse(res, 500, 'Internal server error.')
  }
};
