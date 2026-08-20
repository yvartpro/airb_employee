'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('partners', [
      {
        name: 'Association Test',
        contact_phone: '+243123456789',
        status: 'actif',
        default_commission_rate: 15.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Coopérative Example',
        contact_phone: '+243987654321',
        status: 'actif',
        default_commission_rate: 20.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('partners', {
      name: { [Sequelize.Op.in]: ['Association Test', 'Coopérative Example'] }
    }, {});
  }
};
