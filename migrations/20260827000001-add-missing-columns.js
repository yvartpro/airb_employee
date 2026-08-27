'use strict';

async function addColumnIfMissing(queryInterface, Sequelize, tableName, columnName, definition) {
  const table = await queryInterface.describeTable(tableName);
  if (!table[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}

async function removeColumnIfExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  if (table[columnName]) {
    await queryInterface.removeColumn(tableName, columnName);
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumnIfMissing(queryInterface, Sequelize, 'partners', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await addColumnIfMissing(queryInterface, Sequelize, 'salary_settings', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });

    await addColumnIfMissing(queryInterface, Sequelize, 'commission_transactions', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });

    await addColumnIfMissing(queryInterface, Sequelize, 'activity_logs', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await removeColumnIfExists(queryInterface, 'partners', 'avatar_url');
    await removeColumnIfExists(queryInterface, 'salary_settings', 'updated_at');
    await removeColumnIfExists(queryInterface, 'commission_transactions', 'updated_at');
    await removeColumnIfExists(queryInterface, 'activity_logs', 'updated_at');
  }
};
