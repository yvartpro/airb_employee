'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'gestionnaire', 'lecture_seule'),
      allowNull: false,
      defaultValue: 'admin'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'gestionnaire', 'lecture_seule'),
      allowNull: false,
      defaultValue: 'lecture_seule'
    });
  }
};
