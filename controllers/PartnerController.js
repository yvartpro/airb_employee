const { Partner, ActivityLog } = require('../models');

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll();
    res.json({ success: true, partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }
    res.json({ success: true, partner });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.createPartner = async (req, res) => {
  const { name, contactPhone, status, defaultCommissionRate } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Partner name is required.' });
  }

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

    res.status(201).json({ success: true, message: 'Partner created successfully.', partner });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.updatePartner = async (req, res) => {
  const { id } = req.params;
  const { name, contactPhone, status, defaultCommissionRate } = req.body;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

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

    res.json({ success: true, message: 'Partner updated successfully.', partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.deletePartner = async (req, res) => {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

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

    res.json({ success: true, message: 'Partner deleted successfully.' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
