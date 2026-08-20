'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('commission_transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      salarySettingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'salary_setting_id',
        references: {
          model: 'salary_settings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'transaction_date'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('commission_transactions');
  }
};
