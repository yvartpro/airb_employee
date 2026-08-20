'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salary_settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'assignment_id',
        references: {
          model: 'assignments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      grossSalary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'gross_salary'
      },
      commissionRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        field: 'commission_rate'
      },
      commissionAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'commission_amount'
      },
      netSalary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'net_salary'
      },
      effectiveMonth: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'effective_month'
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
    await queryInterface.dropTable('salary_settings');
  }
};
