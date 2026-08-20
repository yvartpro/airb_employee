'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        full_name: 'Admin User',
        email: 'admin@airb.local',
        phone: '+243123456789',
        role: 'admin',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        full_name: 'Gestionnaire User',
        email: 'gestionnaire@airb.local',
        phone: '+243987654321',
        role: 'gestionnaire',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.in]: ['admin@airb.local', 'gestionnaire@airb.local'] }
    }, {});
  }
};
