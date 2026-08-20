'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'employee_id',
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      partnerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'partner_id',
        references: {
          model: 'partners',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      contractType: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'contract_type'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'start_date'
      },
      durationMonths: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'duration_months'
      },
      renewable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'end_date'
      },
      status: {
        type: Sequelize.ENUM('actif', 'termine', 'a_renouveler'),
        allowNull: false,
        defaultValue: 'actif'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        field: 'updated_at'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assignments');
  }
};
